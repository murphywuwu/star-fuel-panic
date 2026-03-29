"use client";

import { useEffect, useSyncExternalStore } from "react";
import { settlementDemoService } from "@/service/settlementDemoService";

export function useSettlementDemoController(active = true) {
  const state = useSyncExternalStore(
    settlementDemoService.subscribe.bind(settlementDemoService),
    settlementDemoService.getSnapshot.bind(settlementDemoService),
    settlementDemoService.getSnapshot.bind(settlementDemoService)
  );

  useEffect(() => {
    if (active) {
      settlementDemoService.start();
      return () => {
        settlementDemoService.stop();
      };
    }

    settlementDemoService.stop();
    return undefined;
  }, [active]);

  return {
    state,
    actions: {
      play: () => settlementDemoService.start(),
      pause: () => settlementDemoService.pause(),
      replay: () => settlementDemoService.replay(),
      jumpToReport: () => settlementDemoService.jumpToReport()
    }
  };
}
