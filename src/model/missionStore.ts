import { createStore } from "zustand/vanilla";
import type { Mission, MissionSortBy } from "@/types/mission";

export interface MissionState {
  missions: Mission[];
  loading: boolean;
  selectedMissionId: string | null;
}

interface MissionActions {
  setMissions: (missions: Mission[]) => void;
  upsertMission: (mission: Mission) => void;
  setLoading: (loading: boolean) => void;
  selectMission: (missionId: string) => void;
  reset: () => void;
}

export type MissionStore = MissionState & MissionActions;

const initialState: MissionState = {
  missions: [],
  loading: false,
  selectedMissionId: null
};

function urgencyWeight(urgency: Mission["urgency"]) {
  if (urgency === "critical") {
    return 3;
  }
  if (urgency === "warning") {
    return 2;
  }
  return 1;
}

function weightedScore(mission: Mission) {
  return mission.prizePool * urgencyWeight(mission.urgency);
}

export function sortMissions(missions: Mission[], sortBy: MissionSortBy = "weighted") {
  const sorted = [...missions];

  if (sortBy === "created_at") {
    return sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
  if (sortBy === "prize_pool") {
    return sorted.sort((a, b) => b.prizePool - a.prizePool);
  }
  if (sortBy === "urgency") {
    return sorted.sort((a, b) => urgencyWeight(b.urgency) - urgencyWeight(a.urgency) || b.prizePool - a.prizePool);
  }

  return sorted.sort((a, b) => weightedScore(b) - weightedScore(a));
}

export function selectSortedMissions(state: MissionState, sortBy: MissionSortBy = "weighted") {
  return sortMissions(state.missions, sortBy);
}

export function selectSelectedMission(state: MissionState): Mission | null {
  if (!state.selectedMissionId) {
    return null;
  }
  return state.missions.find((mission) => mission.id === state.selectedMissionId) ?? null;
}

export const missionStore = createStore<MissionStore>()((set) => ({
  ...initialState,
  setMissions: (missions) =>
    set((state) => {
      const selectedStillExists =
        state.selectedMissionId !== null && missions.some((mission) => mission.id === state.selectedMissionId);

      return {
        missions,
        selectedMissionId: selectedStillExists ? state.selectedMissionId : missions[0]?.id ?? null
      };
    }),
  upsertMission: (mission) =>
    set((state) => {
      const exists = state.missions.some((item) => item.id === mission.id);
      if (!exists) {
        const next = [...state.missions, mission];
        return {
          missions: next,
          selectedMissionId: state.selectedMissionId ?? mission.id
        };
      }

      return {
        missions: state.missions.map((item) => (item.id === mission.id ? mission : item))
      };
    }),
  setLoading: (loading) => set({ loading }),
  selectMission: (missionId) => set({ selectedMissionId: missionId }),
  reset: () => set({ ...initialState })
}));
