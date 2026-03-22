module fuel_frog_panic::fuel_frog_panic {
    use sui::event;

    const BPS_DENOMINATOR: u64 = 10000;

    const PHASE_LOBBY_READY: u8 = 0;
    const PHASE_PLANNING: u8 = 1;
    const PHASE_MATCH_RUNNING: u8 = 2;
    const PHASE_FINAL_SPRINT: u8 = 3;
    const PHASE_SETTLED: u8 = 4;

    const TEAM_ALPHA: u8 = 0;
    const TEAM_BETA: u8 = 1;

    const E_ROOM_CONFIG_LOCKED: u64 = 1;
    const E_NOT_HOST: u64 = 2;
    const E_INVALID_PLAYER_LIMIT: u64 = 3;
    const E_INVALID_ENTRY_FEE: u64 = 4;
    const E_INVALID_RAKE_BPS: u64 = 5;
    const E_INVALID_HOST_REVSHARE_BPS: u64 = 6;
    const E_INVALID_STATE_TRANSITION: u64 = 7;
    const E_ROOM_FULL: u64 = 8;
    const E_ALREADY_JOINED: u64 = 9;
    const E_ROLE_LOCKED: u64 = 10;
    const E_PLAYER_NOT_JOINED: u64 = 11;
    const E_DUP_SUPPLY_EVENT: u64 = 12;
    const E_NODE_NOT_FOUND: u64 = 13;
    const E_INVALID_TEAM_ID: u64 = 14;
    const E_INVALID_SETTLEMENT_PAYLOAD: u64 = 15;

    public struct NodeProgress has copy, drop, store {
        node_id: u8,
        fill_bps: u64,
        risk_weight_bps: u64,
        completed: bool,
    }

    public struct PlayerContribution has copy, drop, store {
        player: address,
        score: u64,
    }

    public struct SettlementSnapshot has copy, drop, store {
        settled: bool,
        settlement_id: u64,
        gross_pool: u64,
        platform_fee: u64,
        host_fee: u64,
        payout_pool: u64,
    }

    public struct FuelRoom has key {
        id: sui::object::UID,
        host: address,
        phase: u8,
        roles_locked: bool,
        config_locked: bool,
        config_hash: vector<u8>,
        entry_fee_lux: u64,
        player_limit: u64,
        player_buyin_pool: u64,
        host_seed_pool: u64,
        platform_subsidy_pool: u64,
        sponsor_pool: u64,
        platform_rake_bps: u64,
        host_revshare_bps: u64,
        total_contribution: u64,
        team_alpha_score: u64,
        team_beta_score: u64,
        settlement: SettlementSnapshot,
        players: vector<address>,
        contributions: vector<PlayerContribution>,
        nodes: vector<NodeProgress>,
        processed_events: vector<vector<u8>>,
    }

    public struct RoomCreated has copy, drop {
        room_id: sui::object::ID,
        host: address,
        config_hash: vector<u8>,
    }

    public struct PlayerJoined has copy, drop {
        room_id: sui::object::ID,
        player: address,
        player_count: u64,
    }

    public struct RolesLocked has copy, drop {
        room_id: sui::object::ID,
        host: address,
    }

    public struct SupplyRecorded has copy, drop {
        room_id: sui::object::ID,
        player: address,
        node_id: u8,
        event_key: vector<u8>,
        contribution_delta: u64,
        fill_delta_bps: u64,
    }

    public struct SettlementFinalized has copy, drop {
        room_id: sui::object::ID,
        settlement_id: u64,
        gross_pool: u64,
        platform_fee: u64,
        host_fee: u64,
        payout_pool: u64,
        idempotent: bool,
    }

    public struct SettlementCommitment has copy, drop {
        room_id: sui::object::ID,
        result_hash: vector<u8>,
        payout_count: u64,
    }

    public fun create_room(
        entry_fee_lux: u64,
        player_limit: u64,
        host_seed_pool: u64,
        platform_subsidy_pool: u64,
        sponsor_pool: u64,
        platform_rake_bps: u64,
        host_revshare_bps: u64,
        config_hash: vector<u8>,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        assert!(entry_fee_lux > 0, E_INVALID_ENTRY_FEE);
        assert!(player_limit >= 3 && player_limit <= 8, E_INVALID_PLAYER_LIMIT);
        assert!(platform_rake_bps <= 1500, E_INVALID_RAKE_BPS);
        assert!(host_revshare_bps <= 6000, E_INVALID_HOST_REVSHARE_BPS);

        let sender = tx_context::sender(ctx);
        let event_hash = copy config_hash;

        let room = FuelRoom {
            id: object::new(ctx),
            host: sender,
            phase: PHASE_LOBBY_READY,
            roles_locked: false,
            config_locked: true,
            config_hash,
            entry_fee_lux,
            player_limit,
            player_buyin_pool: 0,
            host_seed_pool,
            platform_subsidy_pool,
            sponsor_pool,
            platform_rake_bps,
            host_revshare_bps,
            total_contribution: 0,
            team_alpha_score: 0,
            team_beta_score: 0,
            settlement: SettlementSnapshot {
                settled: false,
                settlement_id: 0,
                gross_pool: 0,
                platform_fee: 0,
                host_fee: 0,
                payout_pool: 0,
            },
            players: vector[],
            contributions: vector[],
            nodes: default_nodes(),
            processed_events: vector[],
        };

        let room_id = object::id(&room);
        event::emit(RoomCreated { room_id, host: sender, config_hash: event_hash });
        transfer::share_object(room);
    }

    public fun update_room_config(room: &mut FuelRoom, new_hash: vector<u8>, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert!(!room.config_locked, E_ROOM_CONFIG_LOCKED);
        room.config_hash = new_hash;
    }

    public fun join_room(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert!(
            room.phase == PHASE_LOBBY_READY || room.phase == PHASE_PLANNING,
            E_INVALID_STATE_TRANSITION,
        );

        let sender = tx_context::sender(ctx);
        assert!((vector::length(&room.players) as u64) < room.player_limit, E_ROOM_FULL);
        assert!(!contains_address(&room.players, sender), E_ALREADY_JOINED);

        vector::push_back(&mut room.players, sender);
        vector::push_back(
            &mut room.contributions,
            PlayerContribution {
                player: sender,
                score: 0,
            },
        );
        room.player_buyin_pool = room.player_buyin_pool + room.entry_fee_lux;

        event::emit(PlayerJoined {
            room_id: object::id(room),
            player: sender,
            player_count: vector::length(&room.players),
        });
    }

    public fun lock_roles(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert!(
            room.phase == PHASE_LOBBY_READY || room.phase == PHASE_PLANNING,
            E_ROLE_LOCKED,
        );

        room.roles_locked = true;
        if (room.phase == PHASE_LOBBY_READY) {
            room.phase = PHASE_PLANNING;
        };

        event::emit(RolesLocked {
            room_id: object::id(room),
            host: tx_context::sender(ctx),
        });
    }

    public fun start_match(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert!(room.roles_locked, E_ROLE_LOCKED);
        assert!(is_valid_transition(room.phase, PHASE_MATCH_RUNNING), E_INVALID_STATE_TRANSITION);
        room.phase = PHASE_MATCH_RUNNING;
    }

    public fun enter_final_sprint(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert!(is_valid_transition(room.phase, PHASE_FINAL_SPRINT), E_INVALID_STATE_TRANSITION);
        room.phase = PHASE_FINAL_SPRINT;
    }

    public fun submit_supply_event(
        room: &mut FuelRoom,
        event_key: vector<u8>,
        node_id: u8,
        contribution_delta: u64,
        fill_delta_bps: u64,
        team_id: u8,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert!(
            room.phase == PHASE_MATCH_RUNNING || room.phase == PHASE_FINAL_SPRINT,
            E_INVALID_STATE_TRANSITION,
        );

        let sender = tx_context::sender(ctx);
        assert!(contains_address(&room.players, sender), E_PLAYER_NOT_JOINED);
        assert!(!contains_event_key(&room.processed_events, &event_key), E_DUP_SUPPLY_EVENT);

        let event_key_for_log = copy event_key;
        vector::push_back(&mut room.processed_events, event_key);

        add_contribution(room, sender, contribution_delta);
        room.total_contribution = room.total_contribution + contribution_delta;

        if (team_id == TEAM_ALPHA) {
            room.team_alpha_score = room.team_alpha_score + contribution_delta;
        } else if (team_id == TEAM_BETA) {
            room.team_beta_score = room.team_beta_score + contribution_delta;
        } else {
            abort E_INVALID_TEAM_ID
        };

        apply_node_fill(room, node_id, fill_delta_bps);

        event::emit(SupplyRecorded {
            room_id: object::id(room),
            player: sender,
            node_id,
            event_key: event_key_for_log,
            contribution_delta,
            fill_delta_bps,
        });
    }

    public fun finalize_settlement(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert!(
            room.phase == PHASE_MATCH_RUNNING || room.phase == PHASE_FINAL_SPRINT || room.phase == PHASE_SETTLED,
            E_INVALID_STATE_TRANSITION,
        );

        let (gross_pool, platform_fee, host_fee, payout_pool) = calculate_settlement_values(
            room.player_buyin_pool,
            room.host_seed_pool,
            room.platform_subsidy_pool,
            room.sponsor_pool,
            room.platform_rake_bps,
            room.host_revshare_bps,
        );

        let was_written = apply_settlement_snapshot(
            &mut room.settlement,
            tx_context::epoch(ctx),
            gross_pool,
            platform_fee,
            host_fee,
            payout_pool,
        );

        if (was_written) {
            room.phase = PHASE_SETTLED;
        };

        event::emit(SettlementFinalized {
            room_id: object::id(room),
            settlement_id: room.settlement.settlement_id,
            gross_pool: room.settlement.gross_pool,
            platform_fee: room.settlement.platform_fee,
            host_fee: room.settlement.host_fee,
            payout_pool: room.settlement.payout_pool,
            idempotent: !was_written,
        });
    }

    public fun end_match_and_settle(
        room: &mut FuelRoom,
        result_hash: vector<u8>,
        payout_addresses: vector<address>,
        payout_amounts: vector<u64>,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert!(
            vector::length(&payout_addresses) == vector::length(&payout_amounts),
            E_INVALID_SETTLEMENT_PAYLOAD,
        );

        event::emit(SettlementCommitment {
            room_id: object::id(room),
            result_hash,
            payout_count: vector::length(&payout_addresses),
        });

        finalize_settlement(room, ctx);
    }

    public fun is_valid_transition(from: u8, to: u8): bool {
        if (from == PHASE_LOBBY_READY) {
            to == PHASE_PLANNING
        } else if (from == PHASE_PLANNING) {
            to == PHASE_MATCH_RUNNING
        } else if (from == PHASE_MATCH_RUNNING) {
            to == PHASE_FINAL_SPRINT || to == PHASE_SETTLED
        } else if (from == PHASE_FINAL_SPRINT) {
            to == PHASE_SETTLED
        } else {
            false
        }
    }

    public fun calculate_settlement_values(
        player_buyin_pool: u64,
        host_seed_pool: u64,
        platform_subsidy_pool: u64,
        sponsor_pool: u64,
        platform_rake_bps: u64,
        host_revshare_bps: u64,
    ): (u64, u64, u64, u64) {
        let gross_pool = player_buyin_pool + host_seed_pool + platform_subsidy_pool + sponsor_pool;
        let platform_fee = (gross_pool * platform_rake_bps) / BPS_DENOMINATOR;
        let host_fee = (platform_fee * host_revshare_bps) / BPS_DENOMINATOR;
        let payout_pool = gross_pool - platform_fee;
        (gross_pool, platform_fee, host_fee, payout_pool)
    }

    public fun phase(room: &FuelRoom): u8 {
        room.phase
    }

    public fun settlement_id(room: &FuelRoom): u64 {
        room.settlement.settlement_id
    }

    public fun settlement_snapshot(room: &FuelRoom): SettlementSnapshot {
        room.settlement
    }

    #[test_only]
    public fun player_count_for_testing(room: &FuelRoom): u64 {
        vector::length(&room.players) as u64
    }

    #[test_only]
    public fun team_scores_for_testing(room: &FuelRoom): (u64, u64) {
        (room.team_alpha_score, room.team_beta_score)
    }

    #[test_only]
    public fun node_fill_and_completed_for_testing(room: &FuelRoom, node_id: u8): (u64, bool) {
        let idx = find_node_index(&room.nodes, node_id);
        assert!(std::option::is_some(&idx), E_NODE_NOT_FOUND);
        let i = std::option::destroy_some(idx);
        let node = vector::borrow(&room.nodes, i);
        (node.fill_bps, node.completed)
    }

    #[test_only]
    public fun settlement_values_for_testing(room: &FuelRoom): (u64, u64, u64, u64) {
        (
            room.settlement.gross_pool,
            room.settlement.platform_fee,
            room.settlement.host_fee,
            room.settlement.payout_pool,
        )
    }

    public fun contribution_of(room: &FuelRoom, player: address): u64 {
        let idx = find_contribution_index(&room.contributions, player);
        if (std::option::is_some(&idx)) {
            let i = std::option::destroy_some(idx);
            let item = vector::borrow(&room.contributions, i);
            item.score
        } else {
            0
        }
    }

    fun assert_host(room: &FuelRoom, sender: address) {
        assert!(room.host == sender, E_NOT_HOST);
    }

    fun default_nodes(): vector<NodeProgress> {
        let mut nodes = vector[];
        vector::push_back(
            &mut nodes,
            NodeProgress {
                node_id: 1,
                fill_bps: 3000,
                risk_weight_bps: 12000,
                completed: false,
            },
        );
        vector::push_back(
            &mut nodes,
            NodeProgress {
                node_id: 2,
                fill_bps: 5500,
                risk_weight_bps: 15000,
                completed: false,
            },
        );
        vector::push_back(
            &mut nodes,
            NodeProgress {
                node_id: 3,
                fill_bps: 2000,
                risk_weight_bps: 18000,
                completed: false,
            },
        );
        nodes
    }

    fun contains_address(players: &vector<address>, target: address): bool {
        let len = vector::length(players);
        let mut i = 0;
        while (i < len) {
            if (*vector::borrow(players, i) == target) {
                return true
            };
            i = i + 1;
        };
        false
    }

    fun contains_event_key(processed: &vector<vector<u8>>, key: &vector<u8>): bool {
        let len = vector::length(processed);
        let mut i = 0;
        while (i < len) {
            if (*vector::borrow(processed, i) == *key) {
                return true
            };
            i = i + 1;
        };
        false
    }

    fun find_contribution_index(items: &vector<PlayerContribution>, player: address): std::option::Option<u64> {
        let len = vector::length(items);
        let mut i = 0;
        while (i < len) {
            let item = vector::borrow(items, i);
            if (item.player == player) {
                return std::option::some(i)
            };
            i = i + 1;
        };
        std::option::none()
    }

    fun find_node_index(items: &vector<NodeProgress>, node_id: u8): std::option::Option<u64> {
        let len = vector::length(items);
        let mut i = 0;
        while (i < len) {
            let item = vector::borrow(items, i);
            if (item.node_id == node_id) {
                return std::option::some(i)
            };
            i = i + 1;
        };
        std::option::none()
    }

    fun add_contribution(room: &mut FuelRoom, player: address, delta: u64) {
        let idx = find_contribution_index(&room.contributions, player);
        if (std::option::is_some(&idx)) {
            let i = std::option::destroy_some(idx);
            let item = vector::borrow_mut(&mut room.contributions, i);
            item.score = item.score + delta;
        } else {
            vector::push_back(
                &mut room.contributions,
                PlayerContribution {
                    player,
                    score: delta,
                },
            );
        };
    }

    fun apply_node_fill(room: &mut FuelRoom, node_id: u8, fill_delta_bps: u64) {
        let idx = find_node_index(&room.nodes, node_id);
        assert!(std::option::is_some(&idx), E_NODE_NOT_FOUND);

        let i = std::option::destroy_some(idx);
        let node = vector::borrow_mut(&mut room.nodes, i);
        let next_fill = if (node.fill_bps + fill_delta_bps > BPS_DENOMINATOR) {
            BPS_DENOMINATOR
        } else {
            node.fill_bps + fill_delta_bps
        };

        node.fill_bps = next_fill;
        if (next_fill == BPS_DENOMINATOR) {
            node.completed = true;
        };
    }

    fun apply_settlement_snapshot(
        snapshot: &mut SettlementSnapshot,
        settlement_id: u64,
        gross_pool: u64,
        platform_fee: u64,
        host_fee: u64,
        payout_pool: u64,
    ): bool {
        if (snapshot.settled) {
            return false
        };

        snapshot.settled = true;
        snapshot.settlement_id = settlement_id;
        snapshot.gross_pool = gross_pool;
        snapshot.platform_fee = platform_fee;
        snapshot.host_fee = host_fee;
        snapshot.payout_pool = payout_pool;
        true
    }

    #[test]
    fun test_settlement_formula() {
        let (gross_pool, platform_fee, host_fee, payout_pool) = calculate_settlement_values(
            600,
            120,
            0,
            0,
            1000,
            4000,
        );

        assert!(gross_pool == 720, 101);
        assert!(platform_fee == 72, 102);
        assert!(host_fee == 28, 103);
        assert!(payout_pool == 648, 104);
    }

    #[test]
    fun test_transition_rules() {
        assert!(is_valid_transition(PHASE_LOBBY_READY, PHASE_PLANNING), 201);
        assert!(is_valid_transition(PHASE_PLANNING, PHASE_MATCH_RUNNING), 202);
        assert!(is_valid_transition(PHASE_MATCH_RUNNING, PHASE_FINAL_SPRINT), 203);
        assert!(is_valid_transition(PHASE_FINAL_SPRINT, PHASE_SETTLED), 204);
        assert!(!is_valid_transition(PHASE_LOBBY_READY, PHASE_SETTLED), 205);
        assert!(!is_valid_transition(PHASE_SETTLED, PHASE_MATCH_RUNNING), 206);
    }

    #[test]
    fun test_replay_event_key_detection() {
        let mut keys = vector[];
        let key_a = b"evt_a";
        let key_b = b"evt_b";

        assert!(!contains_event_key(&keys, &key_a), 301);

        vector::push_back(&mut keys, copy key_a);
        assert!(contains_event_key(&keys, &key_a), 302);
        assert!(!contains_event_key(&keys, &key_b), 303);
    }

    #[test]
    fun test_settlement_idempotent_helper() {
        let mut settlement = SettlementSnapshot {
            settled: false,
            settlement_id: 0,
            gross_pool: 0,
            platform_fee: 0,
            host_fee: 0,
            payout_pool: 0,
        };

        let first = apply_settlement_snapshot(&mut settlement, 42, 900, 90, 36, 810);
        assert!(first, 401);
        assert!(settlement.settlement_id == 42, 402);
        assert!(settlement.payout_pool == 810, 403);

        let second = apply_settlement_snapshot(&mut settlement, 99, 1200, 120, 48, 1080);
        assert!(!second, 404);
        assert!(settlement.settlement_id == 42, 405);
        assert!(settlement.gross_pool == 900, 406);
    }
}

#[test_only]
module fuel_frog_panic::fuel_frog_panic_tests {

use fuel_frog_panic::fuel_frog_panic;
use sui::test_scenario;

const PHASE_SETTLED: u8 = 4;
const TEAM_ALPHA: u8 = 0;
const TEAM_BETA: u8 = 1;

#[test]
fun test_room_happy_path_with_settlement_and_contribution_trace() {
    let mut scenario = test_scenario::begin(@0xA11CE);
    {
        fuel_frog_panic::create_room(
            100,
            4,
            120,
            80,
            50,
            900,
            4000,
            b"cfg-main",
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xA11CE);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xB0B);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xC0C);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xA11CE);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::lock_roles(&mut room, scenario.ctx());
        fuel_frog_panic::start_match(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xB0B);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::submit_supply_event(&mut room, b"evt-001", 1, 30, 7000, TEAM_ALPHA, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xC0C);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::submit_supply_event(&mut room, b"evt-002", 1, 20, 4000, TEAM_BETA, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xA11CE);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::end_match_and_settle(
            &mut room,
            b"result-hash-001",
            vector[@0xB0B, @0xC0C],
            vector[301, 200],
            scenario.ctx(),
        );
        let first_settlement_id = fuel_frog_panic::settlement_id(&room);
        fuel_frog_panic::end_match_and_settle(
            &mut room,
            b"result-hash-001",
            vector[@0xB0B, @0xC0C],
            vector[301, 200],
            scenario.ctx(),
        );
        let second_settlement_id = fuel_frog_panic::settlement_id(&room);

        assert!(fuel_frog_panic::phase(&room) == PHASE_SETTLED, 2001);
        assert!(first_settlement_id == second_settlement_id, 2002);

        let (gross_pool, platform_fee, host_fee, payout_pool) = fuel_frog_panic::settlement_values_for_testing(&room);
        assert!(gross_pool == 550, 2003);
        assert!(platform_fee == 49, 2004);
        assert!(host_fee == 19, 2005);
        assert!(payout_pool == 501, 2006);

        assert!(fuel_frog_panic::player_count_for_testing(&room) == 3, 2007);
        assert!(fuel_frog_panic::contribution_of(&room, @0xB0B) == 30, 2008);
        assert!(fuel_frog_panic::contribution_of(&room, @0xC0C) == 20, 2009);

        let (alpha_score, beta_score) = fuel_frog_panic::team_scores_for_testing(&room);
        assert!(alpha_score == 30, 2010);
        assert!(beta_score == 20, 2011);

        let (node_fill, node_completed) = fuel_frog_panic::node_fill_and_completed_for_testing(&room, 1);
        assert!(node_fill == 10000, 2012);
        assert!(node_completed, 2013);

        test_scenario::return_shared(room);
    };
    scenario.end();
}

#[test]
#[expected_failure]
fun test_end_match_and_settle_rejects_mismatched_payload() {
    let mut scenario = test_scenario::begin(@0xFACE);
    {
        fuel_frog_panic::create_room(
            100,
            4,
            0,
            0,
            0,
            900,
            4000,
            b"cfg-mismatch",
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xFACE);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        fuel_frog_panic::lock_roles(&mut room, scenario.ctx());
        fuel_frog_panic::start_match(&mut room, scenario.ctx());
        fuel_frog_panic::end_match_and_settle(
            &mut room,
            b"bad-payload",
            vector[@0xFACE, @0xBEEF],
            vector[100],
            scenario.ctx(),
        );
        test_scenario::return_shared(room);
    };
    scenario.end();
}

#[test]
#[expected_failure]
fun test_duplicate_supply_event_rejected() {
    let mut scenario = test_scenario::begin(@0xD0D);
    {
        fuel_frog_panic::create_room(
            80,
            4,
            0,
            0,
            0,
            800,
            3000,
            b"cfg-dup",
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xD0D);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        fuel_frog_panic::lock_roles(&mut room, scenario.ctx());
        fuel_frog_panic::start_match(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xE0E);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        fuel_frog_panic::submit_supply_event(&mut room, b"evt-dup", 1, 15, 1000, TEAM_ALPHA, scenario.ctx());
        fuel_frog_panic::submit_supply_event(&mut room, b"evt-dup", 2, 15, 1000, TEAM_ALPHA, scenario.ctx());
        test_scenario::return_shared(room);
    };
    scenario.end();
}

#[test]
#[expected_failure]
fun test_room_full_rejected() {
    let mut scenario = test_scenario::begin(@0xF0F);
    {
        fuel_frog_panic::create_room(
            50,
            3,
            0,
            0,
            0,
            700,
            3000,
            b"cfg-full",
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xF0F);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xF1F);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xF2F);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xF3F);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };
    scenario.end();
}

#[test]
#[expected_failure]
fun test_invalid_team_id_rejected() {
    let mut scenario = test_scenario::begin(@0xABCD);
    {
        fuel_frog_panic::create_room(
            90,
            4,
            0,
            0,
            0,
            900,
            4000,
            b"cfg-team",
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xABCD);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        fuel_frog_panic::lock_roles(&mut room, scenario.ctx());
        fuel_frog_panic::start_match(&mut room, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xA1A1);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        fuel_frog_panic::submit_supply_event(&mut room, b"evt-bad-team", 1, 10, 500, 9, scenario.ctx());
        test_scenario::return_shared(room);
    };
    scenario.end();
}
}
