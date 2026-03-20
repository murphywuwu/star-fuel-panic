module killmail_bingo_ops::kbo_registry;

use sui::event;
use sui::table::{Self, Table};

const PHASE_LOBBY_READY: u8 = 0;
const PHASE_MATCH_RUNNING: u8 = 1;
const PHASE_GRACE_WINDOW: u8 = 2;
const PHASE_SETTLED: u8 = 3;

const E_FEE_BPS_TOO_HIGH: u64 = 1;
const E_HOST_REVSHARE_TOO_HIGH: u64 = 2;
const E_INVALID_PLAYER_COUNT: u64 = 3;
const E_MATCH_NOT_FOUND: u64 = 4;
const E_INVALID_PHASE: u64 = 5;
const E_DUPLICATE_KILLMAIL: u64 = 6;
const E_SLOT_OUT_OF_RANGE: u64 = 7;
const E_ALREADY_SETTLED: u64 = 8;
const E_ALREADY_CLAIMED: u64 = 9;

public struct Registry has key {
    id: UID,
    admin: address,
    next_match_id: u64,
    next_settlement_id: u64,
    matches: Table<u64, MatchState>,
    seen_killmails: Table<vector<u8>, bool>,
}

public struct MatchState has store {
    host: address,
    phase: u8,
    confirmed_slots: u8,
    rejected_slots: u8,
    gross_pool: u64,
    platform_fee: u64,
    host_fee: u64,
    payout_pool: u64,
    settlement_id: u64,
    settled: bool,
    claimed: bool,
    claimed_by: address,
    risk_penalized: bool,
}

public struct MatchCreatedEvent has copy, drop {
    match_id: u64,
    host: address,
    payout_pool: u64,
}

public struct KillmailAcceptedEvent has copy, drop {
    match_id: u64,
    slot_id: u8,
    killmail_id: vector<u8>,
}

public struct MatchSettledEvent has copy, drop {
    match_id: u64,
    settlement_id: u64,
    payout_pool: u64,
}

public struct SettlementClaimedEvent has copy, drop {
    match_id: u64,
    settlement_id: u64,
    claimer: address,
}

fun new_registry(ctx: &mut tx_context::TxContext): Registry {
    Registry {
        id: object::new(ctx),
        admin: tx_context::sender(ctx),
        next_match_id: 0,
        next_settlement_id: 0,
        matches: table::new(ctx),
        seen_killmails: table::new(ctx),
    }
}

fun borrow_match_mut(registry: &mut Registry, match_id: u64): &mut MatchState {
    assert!(table::contains(&registry.matches, match_id), E_MATCH_NOT_FOUND);
    table::borrow_mut(&mut registry.matches, match_id)
}

fun borrow_match(registry: &Registry, match_id: u64): &MatchState {
    assert!(table::contains(&registry.matches, match_id), E_MATCH_NOT_FOUND);
    table::borrow(&registry.matches, match_id)
}

fun init(ctx: &mut tx_context::TxContext) {
    transfer::share_object(new_registry(ctx));
}

#[test_only]
public fun init_for_testing(ctx: &mut tx_context::TxContext) {
    transfer::share_object(new_registry(ctx));
}

public fun create_match(
    registry: &mut Registry,
    host: address,
    entry_fee_lux: u64,
    players: u64,
    platform_fee_bps: u16,
    host_revshare_bps: u16,
): u64 {
    assert!(platform_fee_bps <= 1500, E_FEE_BPS_TOO_HIGH);
    assert!(host_revshare_bps <= 6000, E_HOST_REVSHARE_TOO_HIGH);
    assert!(players > 0, E_INVALID_PLAYER_COUNT);

    let gross_pool = entry_fee_lux * players;
    let platform_fee = (gross_pool * (platform_fee_bps as u64)) / 10000;
    let host_fee = (platform_fee * (host_revshare_bps as u64)) / 10000;
    let payout_pool = gross_pool - platform_fee;

    let match_id = registry.next_match_id;
    registry.next_match_id = match_id + 1;

    table::add(
        &mut registry.matches,
        match_id,
        MatchState {
            host,
            phase: PHASE_LOBBY_READY,
            confirmed_slots: 0,
            rejected_slots: 0,
            gross_pool,
            platform_fee,
            host_fee,
            payout_pool,
            settlement_id: 0,
            settled: false,
            claimed: false,
            claimed_by: @0x0,
            risk_penalized: false,
        },
    );

    event::emit(MatchCreatedEvent {
        match_id,
        host,
        payout_pool,
    });

    match_id
}

public fun start_match(registry: &mut Registry, match_id: u64) {
    let match_ref = borrow_match_mut(registry, match_id);
    assert!(match_ref.phase == PHASE_LOBBY_READY, E_INVALID_PHASE);
    match_ref.phase = PHASE_MATCH_RUNNING;
}

public fun submit_killmail(
    registry: &mut Registry,
    match_id: u64,
    slot_id: u8,
    killmail_id: vector<u8>,
) {
    assert!(!table::contains(&registry.seen_killmails, killmail_id), E_DUPLICATE_KILLMAIL);
    table::add(&mut registry.seen_killmails, copy killmail_id, true);

    let match_ref = borrow_match_mut(registry, match_id);
    assert!(match_ref.phase == PHASE_MATCH_RUNNING, E_INVALID_PHASE);
    assert!(slot_id > 0 && slot_id <= 9, E_SLOT_OUT_OF_RANGE);
    match_ref.confirmed_slots = match_ref.confirmed_slots + 1;

    event::emit(KillmailAcceptedEvent {
        match_id,
        slot_id,
        killmail_id,
    });
}

public fun reject_killmail(registry: &mut Registry, match_id: u64) {
    let match_ref = borrow_match_mut(registry, match_id);
    assert!(match_ref.phase == PHASE_MATCH_RUNNING, E_INVALID_PHASE);
    match_ref.rejected_slots = match_ref.rejected_slots + 1;
}

public fun open_grace_window(registry: &mut Registry, match_id: u64) {
    let match_ref = borrow_match_mut(registry, match_id);
    assert!(match_ref.phase == PHASE_MATCH_RUNNING, E_INVALID_PHASE);
    match_ref.phase = PHASE_GRACE_WINDOW;
}

public fun apply_risk_penalty(registry: &mut Registry, match_id: u64) {
    let match_ref = borrow_match_mut(registry, match_id);
    assert!(match_ref.phase == PHASE_GRACE_WINDOW, E_INVALID_PHASE);
    match_ref.risk_penalized = true;
}

public fun settle_match(
    registry: &mut Registry,
    match_id: u64,
    line_bonus: u64,
    blackout_bonus: u64,
) {
    let settlement_id = registry.next_settlement_id;
    registry.next_settlement_id = settlement_id + 1;

    let match_ref = borrow_match_mut(registry, match_id);
    assert!(match_ref.phase == PHASE_GRACE_WINDOW, E_INVALID_PHASE);
    assert!(!match_ref.settled, E_ALREADY_SETTLED);

    let bonus = if (match_ref.risk_penalized) {
        0
    } else {
        line_bonus + blackout_bonus
    };

    match_ref.payout_pool = match_ref.payout_pool + bonus;
    match_ref.phase = PHASE_SETTLED;
    match_ref.settled = true;
    match_ref.settlement_id = settlement_id;

    event::emit(MatchSettledEvent {
        match_id,
        settlement_id: match_ref.settlement_id,
        payout_pool: match_ref.payout_pool,
    });
}

public fun claim_settlement(
    registry: &mut Registry,
    match_id: u64,
    claimer: address,
): (u64, u64) {
    let match_ref = borrow_match_mut(registry, match_id);
    assert!(match_ref.phase == PHASE_SETTLED, E_INVALID_PHASE);
    assert!(!match_ref.claimed, E_ALREADY_CLAIMED);

    match_ref.claimed = true;
    match_ref.claimed_by = claimer;

    event::emit(SettlementClaimedEvent {
        match_id,
        settlement_id: match_ref.settlement_id,
        claimer,
    });

    (match_ref.settlement_id, match_ref.payout_pool)
}

public fun get_match_phase(registry: &Registry, match_id: u64): u8 {
    borrow_match(registry, match_id).phase
}

public fun get_match_snapshot(
    registry: &Registry,
    match_id: u64,
): (u8, u8, u8, u64, u64, u64, u64, bool, bool, address, bool) {
    let match_ref = borrow_match(registry, match_id);
    (
        match_ref.phase,
        match_ref.confirmed_slots,
        match_ref.rejected_slots,
        match_ref.gross_pool,
        match_ref.platform_fee,
        match_ref.host_fee,
        match_ref.payout_pool,
        match_ref.settled,
        match_ref.claimed,
        match_ref.claimed_by,
        match_ref.risk_penalized,
    )
}

#[test_only]
module killmail_bingo_ops::kbo_registry_tests {

use killmail_bingo_ops::kbo_registry;
use sui::test_scenario;

#[test]
fun test_match_happy_path() {
    let mut scenario = test_scenario::begin(@0xA11CE);
    {
        kbo_registry::init_for_testing(scenario.ctx());
    };

    scenario.next_tx(@0xA11CE);
    {
        let mut registry = scenario.take_shared<kbo_registry::Registry>();
        let match_id = kbo_registry::create_match(&mut registry, @0xA, 80, 8, 1000, 5000);
        kbo_registry::start_match(&mut registry, match_id);
        kbo_registry::submit_killmail(&mut registry, match_id, 1, b"km-001");
        kbo_registry::open_grace_window(&mut registry, match_id);
        kbo_registry::settle_match(&mut registry, match_id, 32, 0);
        let (settlement_id, payout) = kbo_registry::claim_settlement(&mut registry, match_id, @0xA);

        assert!(settlement_id == 0, 1000);
        assert!(payout == 608, 1001);

        let (phase, confirmed, rejected, _, _, _, payout_pool, settled, claimed, claimed_by, risk_penalized) =
            kbo_registry::get_match_snapshot(&registry, match_id);
        assert!(phase == 3, 1002);
        assert!(confirmed == 1, 1003);
        assert!(rejected == 0, 1004);
        assert!(payout_pool == 608, 1005);
        assert!(settled, 1006);
        assert!(claimed, 1007);
        assert!(claimed_by == @0xA, 1008);
        assert!(!risk_penalized, 1009);

        test_scenario::return_shared(registry);
    };
    scenario.end();
}

#[test]
#[expected_failure]
fun test_duplicate_killmail_rejected() {
    let mut scenario = test_scenario::begin(@0xB0B);
    {
        kbo_registry::init_for_testing(scenario.ctx());
    };

    scenario.next_tx(@0xB0B);
    {
        let mut registry = scenario.take_shared<kbo_registry::Registry>();
        let match_id = kbo_registry::create_match(&mut registry, @0xB, 80, 8, 1000, 5000);
        kbo_registry::start_match(&mut registry, match_id);
        kbo_registry::submit_killmail(&mut registry, match_id, 1, b"km-dup");
        kbo_registry::submit_killmail(&mut registry, match_id, 2, b"km-dup");
        test_scenario::return_shared(registry);
    };
    scenario.end();
}

#[test]
#[expected_failure]
fun test_claim_replay_rejected() {
    let mut scenario = test_scenario::begin(@0xCAFE);
    {
        kbo_registry::init_for_testing(scenario.ctx());
    };

    scenario.next_tx(@0xCAFE);
    {
        let mut registry = scenario.take_shared<kbo_registry::Registry>();
        let match_id = kbo_registry::create_match(&mut registry, @0xC, 80, 8, 1000, 5000);
        kbo_registry::start_match(&mut registry, match_id);
        kbo_registry::submit_killmail(&mut registry, match_id, 1, b"km-claim");
        kbo_registry::open_grace_window(&mut registry, match_id);
        kbo_registry::settle_match(&mut registry, match_id, 16, 8);

        let (_settlement_id, _payout) = kbo_registry::claim_settlement(&mut registry, match_id, @0xC);
        let (_settlement_id2, _payout2) = kbo_registry::claim_settlement(&mut registry, match_id, @0xD);
        test_scenario::return_shared(registry);
    };
    scenario.end();
}

#[test]
fun test_risk_penalty_disables_bonus() {
    let mut scenario = test_scenario::begin(@0xE0E0);
    {
        kbo_registry::init_for_testing(scenario.ctx());
    };

    scenario.next_tx(@0xE0E0);
    {
        let mut registry = scenario.take_shared<kbo_registry::Registry>();
        let match_id = kbo_registry::create_match(&mut registry, @0xE, 80, 8, 1000, 5000);
        kbo_registry::start_match(&mut registry, match_id);
        kbo_registry::submit_killmail(&mut registry, match_id, 1, b"km-risk");
        kbo_registry::open_grace_window(&mut registry, match_id);
        kbo_registry::apply_risk_penalty(&mut registry, match_id);
        kbo_registry::settle_match(&mut registry, match_id, 32, 16);

        let (_, _, _, _, _, _, payout_pool, _, _, _, risk_penalized) =
            kbo_registry::get_match_snapshot(&registry, match_id);
        assert!(risk_penalized, 1010);
        assert!(payout_pool == 576, 1011);

        test_scenario::return_shared(registry);
    };
    scenario.end();
}
}
