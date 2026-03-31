import type { FuelConfigCache, FuelGrade, FuelGradeIcon, FuelGradeInfo, FuelGradeTier } from "@/types/fuelGrade";

export const FUEL_CONFIG_REFRESH_MS = 5 * 60 * 1000;

const FUEL_GRADE_DISPLAY: Record<
  FuelGrade,
  {
    tier: FuelGradeTier;
    bonus: number;
    label: string;
    icon: FuelGradeIcon;
  }
> = {
  standard: {
    tier: 1,
    bonus: 1.0,
    label: "Standard",
    icon: "⚪"
  },
  premium: {
    tier: 2,
    bonus: 1.25,
    label: "Premium",
    icon: "🟡"
  },
  refined: {
    tier: 3,
    bonus: 1.5,
    label: "Refined",
    icon: "🟣"
  }
};

function getFuelGradeDisplay(grade: FuelGrade) {
  return FUEL_GRADE_DISPLAY[grade];
}

function toNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

function determineGrade(efficiency: number): FuelGrade {
  if (efficiency >= 71) {
    return "refined";
  }

  if (efficiency >= 41) {
    return "premium";
  }

  return "standard";
}

export function resolveFuelGradeInfo(
  fuelTypeId: number,
  efficiencyOrMap?: number | Record<number, number> | null
): FuelGradeInfo {
  const rawEfficiency =
    typeof efficiencyOrMap === "number"
      ? efficiencyOrMap
      : toNumber(efficiencyOrMap?.[fuelTypeId]);
  const normalizedEfficiency = rawEfficiency != null && rawEfficiency > 0 ? Math.max(0, Math.min(100, rawEfficiency)) : 0;
  const grade = determineGrade(normalizedEfficiency);
  const display = getFuelGradeDisplay(grade);

  return {
    typeId: fuelTypeId,
    efficiency: normalizedEfficiency,
    tier: display.tier,
    grade,
    bonus: display.bonus,
    label: display.label,
    icon: display.icon
  };
}

export function hydrateFuelGradeInfo(
  fuelTypeId: number,
  grade: FuelGrade,
  overrides?: Partial<Pick<FuelGradeInfo, "bonus" | "efficiency">>
): FuelGradeInfo {
  const display = getFuelGradeDisplay(grade);
  return {
    typeId: fuelTypeId,
    efficiency: overrides?.efficiency ?? 0,
    tier: display.tier,
    grade,
    bonus: overrides?.bonus ?? display.bonus,
    label: display.label,
    icon: display.icon
  };
}

export function createEmptyFuelConfigCache(): FuelConfigCache {
  return {
    lastUpdatedAt: null,
    efficiencyMap: {},
    stale: true
  };
}

export function formatFuelGradeBadge(fuelGrade: FuelGradeInfo) {
  return `${fuelGrade.icon} ${fuelGrade.label.toUpperCase()} x${formatFuelMultiplier(fuelGrade.bonus)}`;
}

export function formatFuelMultiplier(value: number) {
  return value.toFixed(Number.isInteger(value) ? 1 : 2);
}
