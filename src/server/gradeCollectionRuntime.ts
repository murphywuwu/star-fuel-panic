import type { FuelGrade } from "@/types/fuelGrade";
import { listPersistedFuelEvents } from "./runtimeProjectionStore";

export interface PlayerGradeCollectionInfo {
  walletAddress: string;
  collectedGrades: FuelGrade[];
  hasAllGrades: boolean;
  gradeDetails: {
    standard: boolean;
    premium: boolean;
    refined: boolean;
  };
}

export function getGradeCollectionForMatch(matchId: string): PlayerGradeCollectionInfo[] {
  const fuelEvents = listPersistedFuelEvents(matchId);

  const playerGrades = new Map<string, Set<FuelGrade>>();

  for (const event of fuelEvents) {
    const wallet = event.senderWallet;
    const grade = event.fuelGrade as FuelGrade;

    if (!playerGrades.has(wallet)) {
      playerGrades.set(wallet, new Set());
    }
    playerGrades.get(wallet)!.add(grade);
  }

  const result: PlayerGradeCollectionInfo[] = [];

  for (const [walletAddress, grades] of playerGrades) {
    const hasStandard = grades.has("standard");
    const hasPremium = grades.has("premium");
    const hasRefined = grades.has("refined");
    const hasAllGrades = hasStandard && hasPremium && hasRefined;

    result.push({
      walletAddress,
      collectedGrades: Array.from(grades),
      hasAllGrades,
      gradeDetails: {
        standard: hasStandard,
        premium: hasPremium,
        refined: hasRefined
      }
    });
  }

  return result;
}

export function getPlayerGradeCollectionForMatch(
  matchId: string,
  walletAddress: string
): PlayerGradeCollectionInfo | null {
  const allCollections = getGradeCollectionForMatch(matchId);
  return allCollections.find((c) => c.walletAddress === walletAddress) ?? null;
}
