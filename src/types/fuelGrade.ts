export type FuelGrade = "standard" | "premium" | "refined";

export type FuelGradeTier = 1 | 2 | 3;

export type FuelGradeIcon = "⚪" | "🟡" | "🟣";

export interface FuelGradeInfo {
  typeId: number;
  efficiency: number;
  tier: FuelGradeTier;
  grade: FuelGrade;
  bonus: number;
  label: string;
  icon: FuelGradeIcon;
}

export interface FuelConfigCache {
  lastUpdatedAt: string | null;
  efficiencyMap: Record<number, number>;
  stale: boolean;
}
