module scrap_relay::relay {
    const BPS_DENOMINATOR: u64 = 10_000;

    const STATE_LOBBY_READY: u8 = 0;
    const STATE_ROLE_LOCK: u8 = 1;
    const STATE_RELAY_RUNNING: u8 = 2;
    const STATE_OVERTIME: u8 = 3;
    const STATE_SETTLED: u8 = 4;

    const MAX_PLATFORM_RAKE_BPS: u16 = 1_500;
    const MAX_HOST_REVSHARE_BPS: u16 = 6_000;

    const ROLE_MINER: u8 = 0;
    const ROLE_RUNNER: u8 = 1;
    const ROLE_ASSEMBLER: u8 = 2;
    const ROLE_GUARD: u8 = 3;

    const FLAG_SHORT_MATCH: u8 = 1;
    const FLAG_REPEATED_ROUTE: u8 = 2;
    const FLAG_CONTRIBUTION_CONCENTRATION: u8 = 3;
    const FLAG_ADDRESS_CLUSTER: u8 = 4;

    const E_INVALID_STATE_TRANSITION: u64 = 1001;
    const E_BLUEPRINT_DEPENDENCY_UNMET: u64 = 1002;
    const E_MATERIAL_NOT_ALLOWED: u64 = 1003;
    const E_PERMISSION_DENIED: u64 = 1005;
    const E_ANTI_ABUSE_FLAGGED: u64 = 1007;
    const E_STEP_NOT_FOUND: u64 = 1008;

    public struct BlueprintStep has copy, drop, store {
        step_id: u8,
        required_type_id: u8,
        required_qty: u64,
        dependencies: vector<u8>,
        completed: bool,
    }

    public struct PlayerRole has copy, drop, store {
        player: address,
        role: u8,
    }

    public struct PlayerContribution has copy, drop, store {
        player: address,
        mining: u64,
        hauling: u64,
        assembly: u64,
        guard: u64,
    }

    public struct SettlementBill has copy, drop, store {
        request_id: u64,
        gross_pool: u64,
        platform_fee: u64,
        host_fee: u64,
        payout_pool: u64,
        winner_payout: u64,
        runnerup_payout: u64,
    }

    public struct ScrapRelayRoom has key {
        id: sui::object::UID,
        host: address,
        state: u8,
        entry_fee_lux: u64,
        player_count: u16,
        platform_rake_bps: u16,
        host_revshare_bps: u16,
        blueprint_steps: vector<BlueprintStep>,
        blocked_steps: vector<u8>,
        roles: vector<PlayerRole>,
        contributions: vector<PlayerContribution>,
        processed_request_ids: vector<u64>,
        settlement: Option<SettlementBill>,
        audit_flags: vector<u8>,
        last_tick_ms: u64,
    }

    public struct RoomCreatedEvent has copy, drop {
        room_id: sui::object::ID,
        host: address,
        entry_fee_lux: u64,
        player_count: u16,
    }

    public struct StepCommittedEvent has copy, drop {
        room_id: sui::object::ID,
        player: address,
        step_id: u8,
        material_type_id: u8,
        material_qty: u64,
    }

    public struct SettlementFinalizedEvent has copy, drop {
        room_id: sui::object::ID,
        request_id: u64,
        gross_pool: u64,
        platform_fee: u64,
        host_fee: u64,
        payout_pool: u64,
    }

    public struct AntiAbuseFlaggedEvent has copy, drop {
        room_id: sui::object::ID,
        request_id: u64,
        flags: vector<u8>,
    }

    entry fun create_room(
        entry_fee_lux: u64,
        player_count: u16,
        platform_rake_bps: u16,
        host_revshare_bps: u16,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        assert!(platform_rake_bps <= MAX_PLATFORM_RAKE_BPS, E_PERMISSION_DENIED);
        assert!(host_revshare_bps <= MAX_HOST_REVSHARE_BPS, E_PERMISSION_DENIED);

        let room = ScrapRelayRoom {
            id: sui::object::new(ctx),
            host: sui::tx_context::sender(ctx),
            state: STATE_LOBBY_READY,
            entry_fee_lux,
            player_count,
            platform_rake_bps,
            host_revshare_bps,
            blueprint_steps: default_blueprint_steps(),
            blocked_steps: vector::empty<u8>(),
            roles: vector::empty<PlayerRole>(),
            contributions: vector::empty<PlayerContribution>(),
            processed_request_ids: vector::empty<u64>(),
            settlement: option::none<SettlementBill>(),
            audit_flags: vector::empty<u8>(),
            last_tick_ms: 0,
        };

        let room_id = sui::object::id(&room);
        sui::event::emit(RoomCreatedEvent {
            room_id,
            host: sui::tx_context::sender(ctx),
            entry_fee_lux,
            player_count,
        });

        sui::transfer::share_object(room);
    }

    entry fun lock_role(
        room: &mut ScrapRelayRoom,
        role: u8,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert!(role <= ROLE_GUARD, E_PERMISSION_DENIED);

        if (room.state == STATE_LOBBY_READY) {
            room.state = STATE_ROLE_LOCK;
        };

        assert!(room.state == STATE_ROLE_LOCK, E_INVALID_STATE_TRANSITION);

        let sender = sui::tx_context::sender(ctx);
        upsert_player_role(room, sender, role);
        ensure_player_contribution(room, sender);
    }

    entry fun start_relay(room: &mut ScrapRelayRoom, ctx: &sui::tx_context::TxContext) {
        assert!(room.state == STATE_ROLE_LOCK, E_INVALID_STATE_TRANSITION);
        assert_host(room, sui::tx_context::sender(ctx));
        assert!(vector::length(&room.roles) > 0, E_PERMISSION_DENIED);
        room.state = STATE_RELAY_RUNNING;
    }

    entry fun commit_step(
        room: &mut ScrapRelayRoom,
        step_id: u8,
        material_type_id: u8,
        material_qty: u64,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert!(room.state == STATE_RELAY_RUNNING || room.state == STATE_OVERTIME, E_INVALID_STATE_TRANSITION);

        let player = sui::tx_context::sender(ctx);
        let role = ensure_role_locked(room, player);

        let step_idx = find_step_index(&room.blueprint_steps, step_id);
        assert!(option::is_some(&step_idx), E_STEP_NOT_FOUND);
        let idx = *option::borrow(&step_idx);

        {
            let step = vector::borrow(&room.blueprint_steps, idx);
            assert!(!step.completed, E_PERMISSION_DENIED);
            assert!(
                dependencies_completed(&room.blueprint_steps, &step.dependencies),
                E_BLUEPRINT_DEPENDENCY_UNMET,
            );
            assert!(step.required_type_id == material_type_id, E_MATERIAL_NOT_ALLOWED);
            assert!(material_qty >= step.required_qty, E_MATERIAL_NOT_ALLOWED);
        };

        {
            let step_mut = vector::borrow_mut(&mut room.blueprint_steps, idx);
            step_mut.completed = true;
        };

        increment_contribution_points(room, player, role, 5);

        sui::event::emit(StepCommittedEvent {
            room_id: sui::object::id(room),
            player,
            step_id,
            material_type_id,
            material_qty,
        });
    }

    entry fun heartbeat_tick(room: &mut ScrapRelayRoom, clock: &sui::clock::Clock) {
        clear_blocked_steps(room);

        let executable_count = recompute_blocked_and_executable(room);
        if (room.state == STATE_RELAY_RUNNING && executable_count == 0 && vector::length(&room.blocked_steps) > 0) {
            room.state = STATE_OVERTIME;
        };

        room.last_tick_ms = sui::clock::timestamp_ms(clock);
    }

    public fun evaluate_anti_abuse(
        match_duration_sec: u64,
        repeated_route_count: u16,
        max_player_contribution_bps: u16,
        same_address_cluster_count: u16,
    ): vector<u8> {
        let mut flags = vector::empty<u8>();

        if (match_duration_sec < 60) {
            vector::push_back(&mut flags, FLAG_SHORT_MATCH);
        };
        if (repeated_route_count >= 5) {
            vector::push_back(&mut flags, FLAG_REPEATED_ROUTE);
        };
        if (max_player_contribution_bps > 8_500) {
            vector::push_back(&mut flags, FLAG_CONTRIBUTION_CONCENTRATION);
        };
        if (same_address_cluster_count >= 3) {
            vector::push_back(&mut flags, FLAG_ADDRESS_CLUSTER);
        };

        flags
    }

    entry fun finalize_settlement(
        room: &mut ScrapRelayRoom,
        request_id: u64,
        match_duration_sec: u64,
        repeated_route_count: u16,
        max_player_contribution_bps: u16,
        same_address_cluster_count: u16,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert!(room.state == STATE_RELAY_RUNNING || room.state == STATE_OVERTIME, E_INVALID_STATE_TRANSITION);
        assert_host(room, sui::tx_context::sender(ctx));

        if (contains_request_id(&room.processed_request_ids, request_id)) {
            return
        };

        let flags = evaluate_anti_abuse(
            match_duration_sec,
            repeated_route_count,
            max_player_contribution_bps,
            same_address_cluster_count,
        );

        if (vector::length(&flags) > 0) {
            room.audit_flags = clone_u8_vector(&flags);
            sui::event::emit(AntiAbuseFlaggedEvent {
                room_id: sui::object::id(room),
                request_id,
                flags,
            });
            abort E_ANTI_ABUSE_FLAGGED
        };

        let gross_pool = room.entry_fee_lux * (room.player_count as u64);
        let platform_fee = gross_pool * (room.platform_rake_bps as u64) / BPS_DENOMINATOR;
        let host_fee = platform_fee * (room.host_revshare_bps as u64) / BPS_DENOMINATOR;
        let payout_pool = gross_pool - platform_fee;
        let winner_payout = payout_pool * 65 / 100;
        let runnerup_payout = payout_pool - winner_payout;

        let bill = SettlementBill {
            request_id,
            gross_pool,
            platform_fee,
            host_fee,
            payout_pool,
            winner_payout,
            runnerup_payout,
        };

        room.settlement = option::some(bill);
        vector::push_back(&mut room.processed_request_ids, request_id);
        room.state = STATE_SETTLED;

        sui::event::emit(SettlementFinalizedEvent {
            room_id: sui::object::id(room),
            request_id,
            gross_pool,
            platform_fee,
            host_fee,
            payout_pool,
        });
    }

    public fun state(room: &ScrapRelayRoom): u8 {
        room.state
    }

    public fun blocked_steps(room: &ScrapRelayRoom): &vector<u8> {
        &room.blocked_steps
    }

    public fun settlement(room: &ScrapRelayRoom): &Option<SettlementBill> {
        &room.settlement
    }

    public fun audit_flags(room: &ScrapRelayRoom): &vector<u8> {
        &room.audit_flags
    }

    fun assert_host(room: &ScrapRelayRoom, sender: address) {
        assert!(sender == room.host, E_PERMISSION_DENIED);
    }

    fun ensure_role_locked(room: &ScrapRelayRoom, player: address): u8 {
        let role = find_player_role(&room.roles, player);
        assert!(option::is_some(&role), E_PERMISSION_DENIED);
        *option::borrow(&role)
    }

    fun default_blueprint_steps(): vector<BlueprintStep> {
        let mut steps = vector::empty<BlueprintStep>();

        vector::push_back(
            &mut steps,
            BlueprintStep {
                step_id: 1,
                required_type_id: 1,
                required_qty: 10,
                dependencies: vector::empty<u8>(),
                completed: false,
            },
        );

        let mut deps_2 = vector::empty<u8>();
        vector::push_back(&mut deps_2, 1);
        vector::push_back(
            &mut steps,
            BlueprintStep {
                step_id: 2,
                required_type_id: 2,
                required_qty: 6,
                dependencies: deps_2,
                completed: false,
            },
        );

        let mut deps_3 = vector::empty<u8>();
        vector::push_back(&mut deps_3, 2);
        vector::push_back(
            &mut steps,
            BlueprintStep {
                step_id: 3,
                required_type_id: 3,
                required_qty: 3,
                dependencies: deps_3,
                completed: false,
            },
        );

        steps
    }

    fun clear_blocked_steps(room: &mut ScrapRelayRoom) {
        room.blocked_steps = vector::empty<u8>();
    }

    fun recompute_blocked_and_executable(room: &mut ScrapRelayRoom): u64 {
        let mut executable_count = 0;
        let mut i = 0;
        while (i < vector::length(&room.blueprint_steps)) {
            let step = vector::borrow(&room.blueprint_steps, i);
            if (!step.completed) {
                if (dependencies_completed(&room.blueprint_steps, &step.dependencies)) {
                    executable_count = executable_count + 1;
                } else {
                    vector::push_back(&mut room.blocked_steps, step.step_id);
                }
            };
            i = i + 1;
        };

        executable_count
    }

    fun dependencies_completed(steps: &vector<BlueprintStep>, dependencies: &vector<u8>): bool {
        let mut i = 0;
        while (i < vector::length(dependencies)) {
            let dep_step_id = *vector::borrow(dependencies, i);
            let dep_idx = find_step_index(steps, dep_step_id);
            if (!option::is_some(&dep_idx)) {
                return false
            };
            let dep = vector::borrow(steps, *option::borrow(&dep_idx));
            if (!dep.completed) {
                return false
            };
            i = i + 1;
        };
        true
    }

    fun find_step_index(steps: &vector<BlueprintStep>, step_id: u8): Option<u64> {
        let mut i = 0;
        while (i < vector::length(steps)) {
            let step = vector::borrow(steps, i);
            if (step.step_id == step_id) {
                return option::some(i)
            };
            i = i + 1;
        };

        option::none<u64>()
    }

    fun find_player_role(roles: &vector<PlayerRole>, player: address): Option<u8> {
        let mut i = 0;
        while (i < vector::length(roles)) {
            let role_ref = vector::borrow(roles, i);
            if (role_ref.player == player) {
                return option::some(role_ref.role)
            };
            i = i + 1;
        };

        option::none<u8>()
    }

    fun upsert_player_role(room: &mut ScrapRelayRoom, player: address, role: u8) {
        let mut i = 0;
        while (i < vector::length(&room.roles)) {
            let role_ref = vector::borrow_mut(&mut room.roles, i);
            if (role_ref.player == player) {
                role_ref.role = role;
                return
            };
            i = i + 1;
        };

        vector::push_back(&mut room.roles, PlayerRole { player, role });
    }

    fun ensure_player_contribution(room: &mut ScrapRelayRoom, player: address) {
        let mut i = 0;
        while (i < vector::length(&room.contributions)) {
            let contribution_ref = vector::borrow(&room.contributions, i);
            if (contribution_ref.player == player) {
                return
            };
            i = i + 1;
        };

        vector::push_back(
            &mut room.contributions,
            PlayerContribution {
                player,
                mining: 0,
                hauling: 0,
                assembly: 0,
                guard: 0,
            },
        );
    }

    fun increment_contribution_points(room: &mut ScrapRelayRoom, player: address, role: u8, points: u64) {
        ensure_player_contribution(room, player);

        let mut i = 0;
        while (i < vector::length(&room.contributions)) {
            let contribution_ref = vector::borrow_mut(&mut room.contributions, i);
            if (contribution_ref.player == player) {
                if (role == ROLE_MINER) {
                    contribution_ref.mining = contribution_ref.mining + points;
                } else if (role == ROLE_RUNNER) {
                    contribution_ref.hauling = contribution_ref.hauling + points;
                } else if (role == ROLE_ASSEMBLER) {
                    contribution_ref.assembly = contribution_ref.assembly + points;
                } else {
                    contribution_ref.guard = contribution_ref.guard + points;
                };
                return
            };
            i = i + 1;
        };
    }

    fun contains_request_id(request_ids: &vector<u64>, request_id: u64): bool {
        let mut i = 0;
        while (i < vector::length(request_ids)) {
            if (*vector::borrow(request_ids, i) == request_id) {
                return true
            };
            i = i + 1;
        };
        false
    }

    fun clone_u8_vector(source: &vector<u8>): vector<u8> {
        let mut out = vector::empty<u8>();
        let mut i = 0;
        while (i < vector::length(source)) {
            vector::push_back(&mut out, *vector::borrow(source, i));
            i = i + 1;
        };
        out
    }

    #[test]
    fun test_anti_abuse_no_flags() {
        let flags = evaluate_anti_abuse(120, 1, 3_000, 1);
        assert!(vector::length(&flags) == 0, 2001);
    }

    #[test]
    fun test_anti_abuse_all_flags() {
        let flags = evaluate_anti_abuse(30, 5, 9_000, 3);
        assert!(vector::length(&flags) == 4, 2002);
        assert!(*vector::borrow(&flags, 0) == FLAG_SHORT_MATCH, 2003);
        assert!(*vector::borrow(&flags, 1) == FLAG_REPEATED_ROUTE, 2004);
        assert!(*vector::borrow(&flags, 2) == FLAG_CONTRIBUTION_CONCENTRATION, 2005);
        assert!(*vector::borrow(&flags, 3) == FLAG_ADDRESS_CLUSTER, 2006);
    }

    #[test]
    fun test_default_blueprint_dependency_chain() {
        let steps = default_blueprint_steps();
        assert!(vector::length(&steps) == 3, 2007);

        let step_two_idx = find_step_index(&steps, 2);
        assert!(option::is_some(&step_two_idx), 2008);
        let step_two = vector::borrow(&steps, *option::borrow(&step_two_idx));
        assert!(vector::length(&step_two.dependencies) == 1, 2009);
        assert!(*vector::borrow(&step_two.dependencies, 0) == 1, 2010);
    }
}
