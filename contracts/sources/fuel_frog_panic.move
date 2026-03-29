module fuel_frog_panic::fuel_frog_panic {
    use sui::balance;
    use sui::coin;
    use sui::event;

    const BPS_DENOMINATOR: u64 = 10000;
    const PLATFORM_FEE_BPS: u64 = 500;
    const MIN_SPONSORSHIP_FEE_LUX: u64 = 50;
    const MAX_ENTRY_FEE_LUX: u64 = 1000;
    const MIN_TEAM_LIMIT: u64 = 2;
    const MAX_TEAM_LIMIT: u64 = 16;
    const MIN_DURATION_HOURS: u64 = 1;
    const MAX_DURATION_HOURS: u64 = 72;
    const MAX_TARGET_NODE_COUNT: u64 = 5;
    const MIN_TEAM_MEMBER_LIMIT: u64 = 3;
    const MAX_TEAM_MEMBER_LIMIT: u64 = 8;

    const MODE_FREE: u8 = 0;
    const MODE_PRECISION: u8 = 1;
    const ROLE_COLLECTOR: u8 = 0;
    const ROLE_HAULER: u8 = 1;
    const ROLE_ESCORT: u8 = 2;
    const APPLICATION_PENDING: u8 = 0;
    const APPLICATION_APPROVED: u8 = 1;
    const APPLICATION_REJECTED: u8 = 2;
    const TEAM_STATUS_FORMING: u8 = 0;
    const TEAM_STATUS_LOCKED: u8 = 1;
    const TEAM_STATUS_PAID: u8 = 2;

    const PHASE_LOBBY_READY: u8 = 0;
    const PHASE_PLANNING: u8 = 1;
    const PHASE_MATCH_RUNNING: u8 = 2;
    const PHASE_FINAL_SPRINT: u8 = 3;
    const PHASE_SETTLED: u8 = 4;

    const E_ROOM_CONFIG_LOCKED: u64 = 1;
    const E_NOT_HOST: u64 = 2;
    const E_INVALID_TEAM_LIMIT: u64 = 3;
    const E_INVALID_ENTRY_FEE: u64 = 4;
    const E_INVALID_PLATFORM_FEE_POLICY: u64 = 5;
    const E_LEGACY_HOST_REVSHARE_DISABLED: u64 = 6;
    const E_INVALID_STATE_TRANSITION: u64 = 7;
    const E_ROOM_FULL: u64 = 8;
    const E_ALREADY_JOINED: u64 = 9;
    const E_ROLE_LOCKED: u64 = 10;
    const E_PLAYER_NOT_JOINED: u64 = 11;
    const E_DUP_SUPPLY_EVENT: u64 = 12;
    const E_NODE_NOT_FOUND: u64 = 13;
    const E_INVALID_TEAM_ID: u64 = 14;
    const E_INVALID_SETTLEMENT_PAYLOAD: u64 = 15;
    const E_INVALID_SPONSORSHIP_FEE: u64 = 16;
    const E_LEGACY_HOST_SEED_DISABLED: u64 = 17;
    const E_INVALID_MODE: u64 = 18;
    const E_INVALID_SOLAR_SYSTEM: u64 = 19;
    const E_INVALID_DURATION_HOURS: u64 = 20;
    const E_TARGET_NODE_REQUIRED: u64 = 21;
    const E_TARGET_NODE_LIMIT_EXCEEDED: u64 = 22;
    const E_MATCH_NOT_PUBLISHED: u64 = 23;
    const E_TEAM_NOT_FOUND: u64 = 24;
    const E_NOT_CAPTAIN: u64 = 25;
    const E_TEAM_ALREADY_LOCKED: u64 = 26;
    const E_TEAM_NOT_LOCKED: u64 = 28;
    const E_INVALID_TEAM_MEMBER_LIMIT: u64 = 29;
    const E_ALREADY_APPLIED: u64 = 30;
    const E_ALREADY_TEAM_MEMBER: u64 = 31;
    const E_APPLICATION_NOT_FOUND: u64 = 32;
    const E_APPLICATION_NOT_PENDING: u64 = 33;
    const E_TEAM_FULL_FOR_APPROVAL: u64 = 34;
    const E_PAYMENT_MISMATCH: u64 = 35;
    const E_INVALID_ROLE: u64 = 36;
    const E_ESCROW_ROOM_MISMATCH: u64 = 37;

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
        payout_pool: u64,
    }

    public struct TeamRegistration has copy, drop, store {
        team_id: u64,
        captain: address,
        name: vector<u8>,
        max_members: u64,
        status: u8,
    }

    public struct TeamMemberRecord has copy, drop, store {
        team_id: u64,
        wallet: address,
        role: u8,
    }

    public struct JoinApplication has copy, drop, store {
        application_id: u64,
        team_id: u64,
        applicant: address,
        role: u8,
        status: u8,
    }

    public struct FuelRoom has key {
        id: sui::object::UID,
        host: address,
        phase: u8,
        mode: u8,
        published: bool,
        roles_locked: bool,
        config_hash: vector<u8>,
        solar_system_id: u64,
        target_node_object_ids: vector<address>,
        entry_fee_lux: u64,
        max_teams: u64,
        duration_hours: u64,
        player_buyin_pool: u64,
        platform_subsidy_pool: u64,
        sponsor_pool: u64,
        team_scores: vector<u64>,
        settlement: SettlementSnapshot,
        players: vector<address>,
        contributions: vector<PlayerContribution>,
        teams: vector<TeamRegistration>,
        team_members: vector<TeamMemberRecord>,
        team_join_applications: vector<JoinApplication>,
        whitelist_snapshot: vector<address>,
        next_team_id: u64,
        next_application_id: u64,
        nodes: vector<NodeProgress>,
        processed_events: vector<vector<u8>>,
    }

    public struct MatchEscrow<phantom T> has key {
        id: sui::object::UID,
        room_id: sui::object::ID,
        sponsor_balance: balance::Balance<T>,
        team_entry_balance: balance::Balance<T>,
    }

    public struct RoomCreated has copy, drop {
        room_id: sui::object::ID,
        host: address,
        config_hash: vector<u8>,
    }

    public struct MatchDraftCreated has copy, drop {
        room_id: sui::object::ID,
        host: address,
        mode: u8,
        solar_system_id: u64,
        sponsorship_fee_lux: u64,
        max_teams: u64,
        duration_hours: u64,
        target_node_count: u64,
    }

    public struct MatchPublished has copy, drop {
        room_id: sui::object::ID,
        host: address,
        mode: u8,
        solar_system_id: u64,
        target_node_count: u64,
    }

    public struct SponsorshipLocked has copy, drop {
        room_id: sui::object::ID,
        escrow_id: sui::object::ID,
        host: address,
        amount: u64,
    }

    public struct TeamEntryLocked has copy, drop {
        room_id: sui::object::ID,
        escrow_id: sui::object::ID,
        team_ref: address,
        captain: address,
        member_count: u64,
        quoted_amount_lux: u64,
        locked_amount: u64,
    }

    public fun create_match_draft(
        mode: u8,
        solar_system_id: u64,
        target_node_object_ids: vector<address>,
        sponsorship_fee_lux: u64,
        max_teams: u64,
        entry_fee_lux: u64,
        duration_hours: u64,
        platform_subsidy_pool: u64,
        config_hash: vector<u8>,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        validate_match_config(
            mode,
            solar_system_id,
            &target_node_object_ids,
            sponsorship_fee_lux,
            max_teams,
            entry_fee_lux,
            duration_hours,
        );

        let sender = tx_context::sender(ctx);
        let room = new_room(
            sender,
            mode,
            false,
            copy config_hash,
            solar_system_id,
            target_node_object_ids,
            entry_fee_lux,
            max_teams,
            duration_hours,
            platform_subsidy_pool,
            sponsorship_fee_lux,
            ctx,
        );

        let room_id = object::id(&room);
        event::emit(MatchDraftCreated {
            room_id,
            host: sender,
            mode,
            solar_system_id,
            sponsorship_fee_lux,
            max_teams,
            duration_hours,
            target_node_count: vector::length(&room.target_node_object_ids),
        });
        transfer::share_object(room);
    }

    public fun publish_match(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert!(!room.published, E_ROOM_CONFIG_LOCKED);
        room.published = true;

        event::emit(MatchPublished {
            room_id: object::id(room),
            host: tx_context::sender(ctx),
            mode: room.mode,
            solar_system_id: room.solar_system_id,
            target_node_count: vector::length(&room.target_node_object_ids),
        });
    }

    public fun publish_match_with_sponsorship<T>(
        mode: u8,
        solar_system_id: u64,
        target_node_object_ids: vector<address>,
        sponsorship_fee_lux: u64,
        max_teams: u64,
        entry_fee_lux: u64,
        duration_hours: u64,
        platform_subsidy_pool: u64,
        config_hash: vector<u8>,
        sponsorship_payment: coin::Coin<T>,
        ctx: &mut sui::tx_context::TxContext,
    ) {
        validate_match_config(
            mode,
            solar_system_id,
            &target_node_object_ids,
            sponsorship_fee_lux,
            max_teams,
            entry_fee_lux,
            duration_hours,
        );

        let sender = tx_context::sender(ctx);
        let sponsor_amount = coin::value(&sponsorship_payment);
        assert!(sponsor_amount > 0, E_PAYMENT_MISMATCH);

        let room = new_room(
            sender,
            mode,
            true,
            copy config_hash,
            solar_system_id,
            target_node_object_ids,
            entry_fee_lux,
            max_teams,
            duration_hours,
            platform_subsidy_pool,
            sponsorship_fee_lux,
            ctx,
        );

        let room_id = object::id(&room);
        let escrow = MatchEscrow<T> {
            id: object::new(ctx),
            room_id,
            sponsor_balance: coin::into_balance(sponsorship_payment),
            team_entry_balance: balance::zero<T>(),
        };
        let escrow_id = object::id(&escrow);

        event::emit(SponsorshipLocked {
            room_id,
            escrow_id,
            host: sender,
            amount: sponsor_amount,
        });
        event::emit(MatchPublished {
            room_id,
            host: sender,
            mode,
            solar_system_id,
            target_node_count: vector::length(&room.target_node_object_ids),
        });

        transfer::share_object(room);
        transfer::share_object(escrow);
    }

    public fun lock_team_entry_with_escrow<T>(
        room: &mut FuelRoom,
        escrow: &mut MatchEscrow<T>,
        team_ref: address,
        member_count: u64,
        payment_amount_lux: u64,
        entry_payment: coin::Coin<T>,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert_published(room);

        let room_id = object::id(room);
        assert!(escrow.room_id == room_id, E_ESCROW_ROOM_MISMATCH);
        assert!(member_count >= MIN_TEAM_MEMBER_LIMIT && member_count <= MAX_TEAM_MEMBER_LIMIT, E_INVALID_TEAM_MEMBER_LIMIT);

        let expected_amount_lux = room.entry_fee_lux * member_count;
        assert!(payment_amount_lux == expected_amount_lux, E_PAYMENT_MISMATCH);

        let sender = tx_context::sender(ctx);
        let locked_amount = coin::value(&entry_payment);
        assert!(locked_amount > 0, E_PAYMENT_MISMATCH);

        room.player_buyin_pool = room.player_buyin_pool + payment_amount_lux;
        balance::join(&mut escrow.team_entry_balance, coin::into_balance(entry_payment));

        event::emit(TeamEntryLocked {
            room_id,
            escrow_id: object::id(escrow),
            team_ref,
            captain: sender,
            member_count,
            quoted_amount_lux: payment_amount_lux,
            locked_amount,
        });
    }

    public fun create_team(
        room: &mut FuelRoom,
        name: vector<u8>,
        max_members: u64,
        captain_role: u8,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert_published(room);
        assert_valid_role(captain_role);
        assert!(max_members >= MIN_TEAM_MEMBER_LIMIT && max_members <= MAX_TEAM_MEMBER_LIMIT, E_INVALID_TEAM_MEMBER_LIMIT);
        assert!((vector::length(&room.teams) as u64) < room.max_teams, E_ROOM_FULL);

        let captain = tx_context::sender(ctx);
        assert!(!is_team_member(room, captain), E_ALREADY_TEAM_MEMBER);

        let team_id = room.next_team_id;
        room.next_team_id = room.next_team_id + 1;

        vector::push_back(
            &mut room.teams,
            TeamRegistration {
                team_id,
                captain,
                name,
                max_members,
                status: TEAM_STATUS_FORMING,
            },
        );
        vector::push_back(
            &mut room.team_members,
            TeamMemberRecord {
                team_id,
                wallet: captain,
                role: captain_role,
            },
        );
        ensure_player_registered(room, captain);

    }

    public fun request_join_team(
        room: &mut FuelRoom,
        team_id: u64,
        role: u8,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert_published(room);
        assert_valid_role(role);

        let team_index = require_team_index(&room.teams, team_id);
        let team = vector::borrow(&room.teams, team_index);
        assert!(team.status == TEAM_STATUS_FORMING, E_TEAM_ALREADY_LOCKED);

        let applicant = tx_context::sender(ctx);
        assert!(!is_team_member(room, applicant), E_ALREADY_TEAM_MEMBER);
        assert!(!has_pending_application(&room.team_join_applications, team_id, applicant), E_ALREADY_APPLIED);

        let application_id = room.next_application_id;
        room.next_application_id = room.next_application_id + 1;
        vector::push_back(
            &mut room.team_join_applications,
            JoinApplication {
                application_id,
                team_id,
                applicant,
                role,
                status: APPLICATION_PENDING,
            },
        );

    }

    public fun approve_join_application(
        room: &mut FuelRoom,
        team_id: u64,
        application_id: u64,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert_published(room);
        let sender = tx_context::sender(ctx);
        assert_captain(room, team_id, sender);

        let app_index = require_application_index(&room.team_join_applications, application_id);
        let application = vector::borrow_mut(&mut room.team_join_applications, app_index);
        assert!(application.team_id == team_id, E_APPLICATION_NOT_FOUND);
        assert!(application.status == APPLICATION_PENDING, E_APPLICATION_NOT_PENDING);

        let team_index = require_team_index(&room.teams, team_id);
        let team = vector::borrow(&room.teams, team_index);
        let member_count = count_team_members(&room.team_members, team_id);
        assert!(member_count < team.max_members, E_TEAM_FULL_FOR_APPROVAL);

        let applicant = application.applicant;
        let role = application.role;
        application.status = APPLICATION_APPROVED;
        let _ = application;
        vector::push_back(
            &mut room.team_members,
            TeamMemberRecord {
                team_id,
                wallet: applicant,
                role,
            },
        );
        ensure_player_registered(room, applicant);

    }

    public fun reject_join_application(
        room: &mut FuelRoom,
        team_id: u64,
        application_id: u64,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert_published(room);
        let sender = tx_context::sender(ctx);
        assert_captain(room, team_id, sender);

        let app_index = require_application_index(&room.team_join_applications, application_id);
        let application = vector::borrow_mut(&mut room.team_join_applications, app_index);
        assert!(application.team_id == team_id, E_APPLICATION_NOT_FOUND);
        assert!(application.status == APPLICATION_PENDING, E_APPLICATION_NOT_PENDING);
        application.status = APPLICATION_REJECTED;
        let _ = application;

    }

    public fun lock_team(
        room: &mut FuelRoom,
        team_id: u64,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert_published(room);
        let sender = tx_context::sender(ctx);
        assert_captain(room, team_id, sender);

        let team_index = require_team_index(&room.teams, team_id);
        let team = vector::borrow_mut(&mut room.teams, team_index);
        assert!(team.status == TEAM_STATUS_FORMING, E_TEAM_ALREADY_LOCKED);
        team.status = TEAM_STATUS_LOCKED;
    }

    public fun pay_team(
        room: &mut FuelRoom,
        team_id: u64,
        payment_amount_lux: u64,
        payment_digest: vector<u8>,
        ctx: &sui::tx_context::TxContext,
    ) {
        assert_published(room);
        let sender = tx_context::sender(ctx);
        assert_captain(room, team_id, sender);

        let team_index = require_team_index(&room.teams, team_id);
        let team = vector::borrow_mut(&mut room.teams, team_index);
        assert!(team.status == TEAM_STATUS_LOCKED, E_TEAM_NOT_LOCKED);

        let member_count = count_team_members(&room.team_members, team_id);
        let expected_amount = room.entry_fee_lux * member_count;
        assert!(payment_amount_lux == expected_amount, E_PAYMENT_MISMATCH);

        let _ = payment_digest;
        team.status = TEAM_STATUS_PAID;
        room.player_buyin_pool = room.player_buyin_pool + payment_amount_lux;
        append_team_whitelist(room, team_id);
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
        assert!(entry_fee_lux <= MAX_ENTRY_FEE_LUX, E_INVALID_ENTRY_FEE);
        assert!(player_limit >= MIN_TEAM_LIMIT && player_limit <= MAX_TEAM_LIMIT, E_INVALID_TEAM_LIMIT);
        assert!(host_seed_pool == 0, E_LEGACY_HOST_SEED_DISABLED);
        assert!(sponsor_pool >= MIN_SPONSORSHIP_FEE_LUX, E_INVALID_SPONSORSHIP_FEE);
        assert!(platform_rake_bps == PLATFORM_FEE_BPS, E_INVALID_PLATFORM_FEE_POLICY);
        assert!(host_revshare_bps == 0, E_LEGACY_HOST_REVSHARE_DISABLED);

        let sender = tx_context::sender(ctx);
        let event_hash = copy config_hash;

        let room = new_room(
            sender,
            MODE_FREE,
            true,
            config_hash,
            1,
            vector[],
            entry_fee_lux,
            player_limit,
            MIN_DURATION_HOURS,
            platform_subsidy_pool,
            sponsor_pool,
            ctx,
        );

        let room_id = object::id(&room);
        event::emit(RoomCreated { room_id, host: sender, config_hash: event_hash });
        transfer::share_object(room);
    }

    public fun update_room_config(room: &mut FuelRoom, new_hash: vector<u8>, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert!(!room.published, E_ROOM_CONFIG_LOCKED);
        room.config_hash = new_hash;
    }

    public fun join_room(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_published(room);
        assert!(
            room.phase == PHASE_LOBBY_READY || room.phase == PHASE_PLANNING,
            E_INVALID_STATE_TRANSITION,
        );

        let sender = tx_context::sender(ctx);
        assert!((vector::length(&room.players) as u64) < room.max_teams, E_ROOM_FULL);
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
    }

    public fun lock_roles(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert_published(room);
        assert!(
            room.phase == PHASE_LOBBY_READY || room.phase == PHASE_PLANNING,
            E_ROLE_LOCKED,
        );

        room.roles_locked = true;
        if (room.phase == PHASE_LOBBY_READY) {
            room.phase = PHASE_PLANNING;
        };
    }

    public fun start_match(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert_published(room);
        assert!(room.roles_locked, E_ROLE_LOCKED);
        assert!(is_valid_transition(room.phase, PHASE_MATCH_RUNNING), E_INVALID_STATE_TRANSITION);
        room.phase = PHASE_MATCH_RUNNING;
    }

    public fun enter_final_sprint(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert_published(room);
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

        add_team_score(room, team_id, contribution_delta);

        apply_node_fill(room, node_id, fill_delta_bps);
        let _ = event_key_for_log;
    }

    public fun finalize_settlement(room: &mut FuelRoom, ctx: &sui::tx_context::TxContext) {
        assert_host(room, tx_context::sender(ctx));
        assert_published(room);
        assert!(
            room.phase == PHASE_MATCH_RUNNING || room.phase == PHASE_FINAL_SPRINT || room.phase == PHASE_SETTLED,
            E_INVALID_STATE_TRANSITION,
        );

        let (gross_pool, platform_fee, payout_pool) = calculate_settlement_values(
            room.player_buyin_pool,
            room.platform_subsidy_pool,
            room.sponsor_pool,
        );

        let was_written = apply_settlement_snapshot(
            &mut room.settlement,
            tx_context::epoch(ctx),
            gross_pool,
            platform_fee,
            payout_pool,
        );

        if (was_written) {
            room.phase = PHASE_SETTLED;
        };
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

        let _ = result_hash;
        let _ = payout_addresses;
        let _ = payout_amounts;

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
        platform_subsidy_pool: u64,
        sponsor_pool: u64,
    ): (u64, u64, u64) {
        let gross_pool = player_buyin_pool + platform_subsidy_pool + sponsor_pool;
        let platform_fee = (gross_pool * PLATFORM_FEE_BPS) / BPS_DENOMINATOR;
        let payout_pool = gross_pool - platform_fee;
        (gross_pool, platform_fee, payout_pool)
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
    public fun team_count_for_testing(room: &FuelRoom): u64 {
        vector::length(&room.teams) as u64
    }

    #[test_only]
    public fun team_scores_for_testing(room: &FuelRoom): (u64, u64) {
        let alpha = if (vector::length(&room.team_scores) > 0) *vector::borrow(&room.team_scores, 0) else 0;
        let beta = if (vector::length(&room.team_scores) > 1) *vector::borrow(&room.team_scores, 1) else 0;
        (alpha, beta)
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
    public fun settlement_values_for_testing(room: &FuelRoom): (u64, u64, u64) {
        (
            room.settlement.gross_pool,
            room.settlement.platform_fee,
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

    #[test_only]
    public fun target_node_count_for_testing(room: &FuelRoom): u64 {
        vector::length(&room.target_node_object_ids)
    }

    #[test_only]
    public fun whitelist_count_for_testing(room: &FuelRoom): u64 {
        vector::length(&room.whitelist_snapshot) as u64
    }

    #[test_only]
    public fun sponsorship_balance_for_testing<T>(escrow: &MatchEscrow<T>): u64 {
        balance::value(&escrow.sponsor_balance)
    }

    public fun team_entry_balance_for_testing<T>(escrow: &MatchEscrow<T>): u64 {
        balance::value(&escrow.team_entry_balance)
    }

    #[test_only]
    public fun team_paid_for_testing(room: &FuelRoom, team_id: u64): bool {
        let idx = require_team_index(&room.teams, team_id);
        let team = vector::borrow(&room.teams, idx);
        team.status == TEAM_STATUS_PAID
    }

    fun assert_host(room: &FuelRoom, sender: address) {
        assert!(room.host == sender, E_NOT_HOST);
    }

    fun assert_published(room: &FuelRoom) {
        assert!(room.published, E_MATCH_NOT_PUBLISHED);
    }

    fun assert_valid_role(role: u8) {
        assert!(
            role == ROLE_COLLECTOR || role == ROLE_HAULER || role == ROLE_ESCORT,
            E_INVALID_ROLE,
        );
    }

    fun require_team_index(items: &vector<TeamRegistration>, team_id: u64): u64 {
        let len = vector::length(items);
        let mut i = 0;
        while (i < len) {
            let item = vector::borrow(items, i);
            if (item.team_id == team_id) {
                return i
            };
            i = i + 1;
        };
        abort E_TEAM_NOT_FOUND
    }

    fun require_application_index(items: &vector<JoinApplication>, application_id: u64): u64 {
        let len = vector::length(items);
        let mut i = 0;
        while (i < len) {
            let item = vector::borrow(items, i);
            if (item.application_id == application_id) {
                return i
            };
            i = i + 1;
        };
        abort E_APPLICATION_NOT_FOUND
    }

    fun assert_captain(room: &FuelRoom, team_id: u64, sender: address) {
        let team_index = require_team_index(&room.teams, team_id);
        let team = vector::borrow(&room.teams, team_index);
        assert!(team.captain == sender, E_NOT_CAPTAIN);
    }

    fun count_team_members(items: &vector<TeamMemberRecord>, team_id: u64): u64 {
        let len = vector::length(items);
        let mut count = 0;
        let mut i = 0;
        while (i < len) {
            let item = vector::borrow(items, i);
            if (item.team_id == team_id) {
                count = count + 1;
            };
            i = i + 1;
        };
        count
    }

    fun is_team_member(room: &FuelRoom, wallet: address): bool {
        let len = vector::length(&room.team_members);
        let mut i = 0;
        while (i < len) {
            let item = vector::borrow(&room.team_members, i);
            if (item.wallet == wallet) {
                return true
            };
            i = i + 1;
        };
        false
    }

    fun has_pending_application(items: &vector<JoinApplication>, team_id: u64, applicant: address): bool {
        let len = vector::length(items);
        let mut i = 0;
        while (i < len) {
            let item = vector::borrow(items, i);
            if (
                item.team_id == team_id
                && item.applicant == applicant
                && item.status == APPLICATION_PENDING
            ) {
                return true
            };
            i = i + 1;
        };
        false
    }

    fun ensure_player_registered(room: &mut FuelRoom, player: address) {
        if (contains_address(&room.players, player)) {
            return
        };

        vector::push_back(&mut room.players, player);
        vector::push_back(
            &mut room.contributions,
            PlayerContribution {
                player,
                score: 0,
            },
        );
    }

    fun append_team_whitelist(room: &mut FuelRoom, team_id: u64) {
        let len = vector::length(&room.team_members);
        let mut i = 0;
        while (i < len) {
            let item = vector::borrow(&room.team_members, i);
            if (item.team_id == team_id && !contains_address(&room.whitelist_snapshot, item.wallet)) {
                vector::push_back(&mut room.whitelist_snapshot, item.wallet);
            };
            i = i + 1;
        };
    }

    fun validate_match_config(
        mode: u8,
        solar_system_id: u64,
        target_node_object_ids: &vector<address>,
        sponsorship_fee_lux: u64,
        max_teams: u64,
        entry_fee_lux: u64,
        duration_hours: u64,
    ) {
        assert!(mode == MODE_FREE || mode == MODE_PRECISION, E_INVALID_MODE);
        assert!(solar_system_id > 0, E_INVALID_SOLAR_SYSTEM);
        assert!(sponsorship_fee_lux >= MIN_SPONSORSHIP_FEE_LUX, E_INVALID_SPONSORSHIP_FEE);
        assert!(max_teams >= MIN_TEAM_LIMIT && max_teams <= MAX_TEAM_LIMIT, E_INVALID_TEAM_LIMIT);
        assert!(entry_fee_lux <= MAX_ENTRY_FEE_LUX, E_INVALID_ENTRY_FEE);
        assert!(
            duration_hours >= MIN_DURATION_HOURS && duration_hours <= MAX_DURATION_HOURS,
            E_INVALID_DURATION_HOURS,
        );

        let target_count = vector::length(target_node_object_ids);
        if (mode == MODE_FREE) {
            assert!(target_count == 0, E_TARGET_NODE_LIMIT_EXCEEDED);
        } else {
            assert!(target_count > 0, E_TARGET_NODE_REQUIRED);
            assert!(target_count <= MAX_TARGET_NODE_COUNT, E_TARGET_NODE_LIMIT_EXCEEDED);
        };
    }

    fun new_room(
        host: address,
        mode: u8,
        published: bool,
        config_hash: vector<u8>,
        solar_system_id: u64,
        target_node_object_ids: vector<address>,
        entry_fee_lux: u64,
        max_teams: u64,
        duration_hours: u64,
        platform_subsidy_pool: u64,
        sponsor_pool: u64,
        ctx: &mut sui::tx_context::TxContext,
    ): FuelRoom {
        FuelRoom {
            id: object::new(ctx),
            host,
            phase: PHASE_LOBBY_READY,
            mode,
            published,
            roles_locked: false,
            config_hash,
            solar_system_id,
            target_node_object_ids,
            entry_fee_lux,
            max_teams,
            duration_hours,
            player_buyin_pool: 0,
            platform_subsidy_pool,
            sponsor_pool,
            team_scores: init_team_scores(max_teams),
            settlement: SettlementSnapshot {
                settled: false,
                settlement_id: 0,
                gross_pool: 0,
                platform_fee: 0,
                payout_pool: 0,
            },
            players: vector[],
            contributions: vector[],
            teams: vector[],
            team_members: vector[],
            team_join_applications: vector[],
            whitelist_snapshot: vector[],
            next_team_id: 0,
            next_application_id: 0,
            nodes: default_nodes(),
            processed_events: vector[],
        }
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

    fun init_team_scores(team_limit: u64): vector<u64> {
        let mut scores = vector[];
        let mut i = 0;
        while (i < team_limit) {
            vector::push_back(&mut scores, 0);
            i = i + 1;
        };
        scores
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

    fun add_team_score(room: &mut FuelRoom, team_id: u8, delta: u64) {
        let index = team_id as u64;
        assert!(index < vector::length(&room.team_scores), E_INVALID_TEAM_ID);
        let score = vector::borrow_mut(&mut room.team_scores, index);
        *score = *score + delta;
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
        payout_pool: u64,
    ): bool {
        if (snapshot.settled) {
            return false
        };

        snapshot.settled = true;
        snapshot.settlement_id = settlement_id;
        snapshot.gross_pool = gross_pool;
        snapshot.platform_fee = platform_fee;
        snapshot.payout_pool = payout_pool;
        true
    }

    #[test]
    fun test_settlement_formula() {
        let (gross_pool, platform_fee, payout_pool) = calculate_settlement_values(
            600,
            0,
            500,
        );

        assert!(gross_pool == 1100, 101);
        assert!(platform_fee == 55, 102);
        assert!(payout_pool == 1045, 103);
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
            payout_pool: 0,
        };

        let first = apply_settlement_snapshot(&mut settlement, 42, 900, 90, 810);
        assert!(first, 401);
        assert!(settlement.settlement_id == 42, 402);
        assert!(settlement.payout_pool == 810, 403);

        let second = apply_settlement_snapshot(&mut settlement, 99, 1200, 120, 1080);
        assert!(!second, 404);
        assert!(settlement.settlement_id == 42, 405);
        assert!(settlement.gross_pool == 900, 406);
    }
}

#[test_only]
module fuel_frog_panic::fuel_frog_panic_tests {

use fuel_frog_panic::fuel_frog_panic;
use sui::coin;
use sui::sui::SUI;
use sui::test_scenario;

const PHASE_SETTLED: u8 = 4;
const PHASE_LOBBY_READY: u8 = 0;
const TEAM_ALPHA: u8 = 0;
const TEAM_BETA: u8 = 1;
const MODE_FREE: u8 = 0;
const MODE_PRECISION: u8 = 1;
const ROLE_COLLECTOR: u8 = 0;
const ROLE_HAULER: u8 = 1;
const ROLE_ESCORT: u8 = 2;

#[test]
fun test_room_happy_path_with_settlement_and_contribution_trace() {
    let mut scenario = test_scenario::begin(@0xA11CE);
    {
        fuel_frog_panic::create_room(
            100,
            4,
            0,
            80,
            500,
            500,
            0,
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

        let (gross_pool, platform_fee, payout_pool) = fuel_frog_panic::settlement_values_for_testing(&room);
        assert!(gross_pool == 880, 2003);
        assert!(platform_fee == 44, 2004);
        assert!(payout_pool == 836, 2005);

        assert!(fuel_frog_panic::player_count_for_testing(&room) == 3, 2006);
        assert!(fuel_frog_panic::contribution_of(&room, @0xB0B) == 30, 2007);
        assert!(fuel_frog_panic::contribution_of(&room, @0xC0C) == 20, 2008);

        let (alpha_score, beta_score) = fuel_frog_panic::team_scores_for_testing(&room);
        assert!(alpha_score == 30, 2009);
        assert!(beta_score == 20, 2010);

        let (node_fill, node_completed) = fuel_frog_panic::node_fill_and_completed_for_testing(&room, 1);
        assert!(node_fill == 10000, 2011);
        assert!(node_completed, 2012);

        test_scenario::return_shared(room);
    };
    scenario.end();
}

#[test]
fun test_create_match_draft_then_publish() {
    let mut scenario = test_scenario::begin(@0xCAFE);
    {
        fuel_frog_panic::create_match_draft(
            MODE_FREE,
            30000142,
            vector[],
            500,
            4,
            0,
            2,
            80,
            b"cfg-draft",
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xCAFE);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::publish_match(&mut room, scenario.ctx());
        fuel_frog_panic::join_room(&mut room, scenario.ctx());
        assert!(fuel_frog_panic::player_count_for_testing(&room) == 1, 2021);
        test_scenario::return_shared(room);
    };
    scenario.end();
}

#[test]
fun test_publish_match_with_sponsorship_escrow() {
    let mut scenario = test_scenario::begin(@0xCAFE);
    {
        let sponsorship_payment = coin::mint_for_testing<SUI>(50_000_000_000, scenario.ctx());
        fuel_frog_panic::publish_match_with_sponsorship<SUI>(
            MODE_FREE,
            30000142,
            vector[],
            50,
            4,
            0,
            2,
            80,
            b"cfg-escrow-publish",
            sponsorship_payment,
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xCAFE);
    {
        let room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        assert!(fuel_frog_panic::phase(&room) == PHASE_LOBBY_READY, 2023);
        assert!(fuel_frog_panic::target_node_count_for_testing(&room) == 0, 2024);
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xCAFE);
    {
        let escrow = scenario.take_shared<fuel_frog_panic::MatchEscrow<SUI>>();
        assert!(fuel_frog_panic::sponsorship_balance_for_testing(&escrow) == 50_000_000_000, 2025);
        assert!(fuel_frog_panic::team_entry_balance_for_testing(&escrow) == 0, 2026);
        test_scenario::return_shared(escrow);
    };
    scenario.end();
}

#[test]
fun test_lock_team_entry_with_match_escrow() {
    let mut scenario = test_scenario::begin(@0xCAFE);
    {
        let sponsorship_payment = coin::mint_for_testing<SUI>(50_000_000_000, scenario.ctx());
        fuel_frog_panic::publish_match_with_sponsorship<SUI>(
            MODE_FREE,
            30000142,
            vector[],
            50,
            4,
            100,
            2,
            80,
            b"cfg-team-escrow-lock",
            sponsorship_payment,
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xCAFE);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        let mut escrow = scenario.take_shared<fuel_frog_panic::MatchEscrow<SUI>>();
        let entry_payment = coin::mint_for_testing<SUI>(300_000_000_000, scenario.ctx());
        fuel_frog_panic::lock_team_entry_with_escrow<SUI>(
            &mut room,
            &mut escrow,
            @0x1,
            3,
            300,
            entry_payment,
            scenario.ctx(),
        );
        assert!(fuel_frog_panic::team_entry_balance_for_testing(&escrow) == 300_000_000_000, 2027);
        test_scenario::return_shared(room);
        test_scenario::return_shared(escrow);
    };
    scenario.end();
}

#[test]
fun test_precision_draft_keeps_target_object_ids() {
    let mut scenario = test_scenario::begin(@0xC0DE);
    {
        fuel_frog_panic::create_match_draft(
            MODE_PRECISION,
            30000142,
            vector[@0x11, @0x22],
            500,
            4,
            100,
            2,
            0,
            b"cfg-precision-ok",
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xC0DE);
    {
        let room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        assert!(fuel_frog_panic::target_node_count_for_testing(&room) == 2, 2022);
        test_scenario::return_shared(room);
    };
    scenario.end();
}

#[test]
fun test_team_flow_lock_pay_and_whitelist_snapshot() {
    let mut scenario = test_scenario::begin(@0xCAFE);
    {
        fuel_frog_panic::create_match_draft(
            MODE_FREE,
            30000142,
            vector[],
            500,
            4,
            100,
            2,
            80,
            b"cfg-team-flow",
            scenario.ctx(),
        );
    };

    scenario.next_tx(@0xCAFE);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::publish_match(&mut room, scenario.ctx());
        fuel_frog_panic::create_team(&mut room, b"Alpha Squad", 3, ROLE_COLLECTOR, scenario.ctx());
        assert!(fuel_frog_panic::team_count_for_testing(&room) == 1, 2030);
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xB0B);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::request_join_team(&mut room, 0, ROLE_HAULER, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xC0C);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::request_join_team(&mut room, 0, ROLE_ESCORT, scenario.ctx());
        test_scenario::return_shared(room);
    };

    scenario.next_tx(@0xCAFE);
    {
        let mut room = scenario.take_shared<fuel_frog_panic::FuelRoom>();
        fuel_frog_panic::approve_join_application(&mut room, 0, 0, scenario.ctx());
        fuel_frog_panic::approve_join_application(&mut room, 0, 1, scenario.ctx());
        fuel_frog_panic::lock_team(&mut room, 0, scenario.ctx());
        fuel_frog_panic::pay_team(&mut room, 0, 300, b"tx-team-pay", scenario.ctx());
        assert!(fuel_frog_panic::team_paid_for_testing(&room, 0), 2031);
        assert!(fuel_frog_panic::whitelist_count_for_testing(&room) == 3, 2032);
        test_scenario::return_shared(room);
    };
    scenario.end();
}

#[test]
#[expected_failure]
fun test_precision_match_requires_targets() {
    let mut scenario = test_scenario::begin(@0xDADA);
    {
        fuel_frog_panic::create_match_draft(
            MODE_PRECISION,
            30000142,
            vector[],
            500,
            4,
            100,
            2,
            0,
            b"cfg-precision",
            scenario.ctx(),
        );
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
            500,
            500,
            0,
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
            500,
            500,
            0,
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
            500,
            500,
            0,
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
            500,
            500,
            0,
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
