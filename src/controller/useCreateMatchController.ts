"use client";

import { useMemo, useSyncExternalStore } from "react";
import { createMatchService } from "@/service/createMatchService";

export function useCreateMatchController() {
  const state = useSyncExternalStore(
    createMatchService.subscribe,
    createMatchService.getSnapshot,
    createMatchService.getSnapshot
  );

  const actions = useMemo(
    () => ({
      setField: createMatchService.setField.bind(createMatchService),
      searchSystems: createMatchService.searchSystems.bind(createMatchService),
      selectSystem: createMatchService.selectSystem.bind(createMatchService),
      toggleTargetNode: createMatchService.toggleTargetNode.bind(createMatchService),
      createDraft: createMatchService.createDraft.bind(createMatchService),
      executePublishEscrowTransaction: createMatchService.executePublishEscrowTransaction.bind(createMatchService),
      publish: createMatchService.publish.bind(createMatchService),
      reset: createMatchService.reset.bind(createMatchService)
    }),
    []
  );

  return {
    state,
    actions
  };
}
