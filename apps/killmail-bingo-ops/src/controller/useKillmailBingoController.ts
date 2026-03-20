"use client";

import { useMemo, useRef, useState } from "react";

import { useKillmailBingoService, useKillmailBingoViewState } from "@/service/killmailBingoService";
import type { DomainError } from "@/types/killmail";

const SUBMIT_THROTTLE_MS = 800;

function toReadableMessage(error: DomainError) {
  switch (error.code) {
    case "E_INVALID_INPUT":
      return "INPUT_INVALID // CHECK FIELDS";
    case "E_DUPLICATE_KILLMAIL":
      return "DUPLICATE_KILLMAIL // EVENT REJECTED";
    case "E_VERIFICATION_TIMEOUT":
      return "VERIFICATION_TIMEOUT // RETRY LATER";
    case "E_INVALID_STATE_TRANSITION":
      return "STATE_TRANSITION_DENIED // CHECK PHASE";
    case "E_SETTLEMENT_REPLAY":
      return "SETTLEMENT_ALREADY_CLAIMED";
    case "E_PERMISSION_DENIED":
      return "PERMISSION_DENIED // PILOT AUTH REQUIRED";
    case "E_MATCH_NOT_FOUND":
      return "MATCH_NOT_FOUND // CREATE ROOM FIRST";
    case "E_CHAIN_UNAVAILABLE":
      return "CHAIN_UNAVAILABLE // RETRY LATER";
    default:
      return error.message;
  }
}

export function useKillmailBingoController() {
  const service = useKillmailBingoService();
  const viewState = useKillmailBingoViewState();

  const [lastUiError, setLastUiError] = useState<string | null>(null);
  const lastSubmitRef = useRef(0);

  function handleError<T extends { ok: boolean; error?: DomainError }>(result: T) {
    if (!result.ok && result.error) {
      setLastUiError(toReadableMessage(result.error));
    }
    return result;
  }

  return useMemo(
    () => ({
      viewState,
      lastUiError,
      onCreateRoom(entryFee: number) {
        setLastUiError(null);
        return handleError(service.initializeMatch(entryFee));
      },
      onStartMatch() {
        setLastUiError(null);
        return handleError(service.startMatch());
      },
      onSubmitKillmail(killmailId: string, actorId: string) {
        const now = Date.now();
        if (now - lastSubmitRef.current < SUBMIT_THROTTLE_MS) {
          return {
            ok: false as const,
            error: {
              code: "E_INVALID_INPUT" as const,
              message: "submit throttled"
            }
          };
        }
        lastSubmitRef.current = now;

        setLastUiError(null);
        return handleError(
          service.ingestKillmail({
            killmailId,
            actorId,
            occurredAt: new Date().toISOString()
          })
        );
      },
      onRefreshMatchState() {
        return service.refreshMatchState();
      },
      onOpenGraceWindow() {
        setLastUiError(null);
        return handleError(service.openGraceWindow());
      },
      onFinalizeSettlement() {
        setLastUiError(null);
        return handleError(service.finalizeSettlement());
      },
      onClaimSettlement(pilotId: string) {
        setLastUiError(null);
        return handleError(service.claimSettlement(pilotId));
      }
    }),
    [lastUiError, service, viewState]
  );
}
