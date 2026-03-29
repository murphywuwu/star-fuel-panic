"use client";

import { useEffect, useSyncExternalStore } from "react";
import { matchDemoReplayService } from "@/service/matchDemoReplayService";

export function useMatchDemoReplayController(active = true) {
  const state = useSyncExternalStore(
    matchDemoReplayService.subscribe.bind(matchDemoReplayService),
    matchDemoReplayService.getSnapshot.bind(matchDemoReplayService),
    matchDemoReplayService.getSnapshot.bind(matchDemoReplayService)
  );

  useEffect(() => {
    if (active) {
      matchDemoReplayService.start();
      return () => {
        matchDemoReplayService.stop();
      };
    }

    matchDemoReplayService.stop();
    return undefined;
  }, [active]);

  return {
    state,
    actions: {
      play: () => matchDemoReplayService.start(),
      pause: () => matchDemoReplayService.pause(),
      replay: () => matchDemoReplayService.replay(),
      jumpToPanic: () => matchDemoReplayService.jumpToPanic()
    }
  };
}
