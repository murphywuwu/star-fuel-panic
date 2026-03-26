"use client";

import { useSyncExternalStore } from "react";
import { createMatchService } from "@/service/createMatchService";

export function useCreateMatchController() {
  const state = useSyncExternalStore(
    createMatchService.subscribe,
    createMatchService.getSnapshot,
    createMatchService.getSnapshot
  );

  return {
    state,
    actions: {
      setField: createMatchService.setField.bind(createMatchService),
      createDraft: createMatchService.createDraft.bind(createMatchService),
      publish: createMatchService.publish.bind(createMatchService),
      reset: createMatchService.reset.bind(createMatchService)
    }
  };
}
