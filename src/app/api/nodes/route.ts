import { NextResponse } from "next/server";
import { listNodes } from "@/server/nodeRuntime";
import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";
import type { UrgencyLevel } from "@/types/mission";
import type { NodeFilters } from "@/types/node";

export const dynamic = "force-dynamic";

function parseUrgency(value: string | null): UrgencyLevel | undefined {
  if (value === "critical" || value === "warning" || value === "safe") {
    return value;
  }
  return undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true" || value === "1") {
    return true;
  }
  if (value === "false" || value === "0") {
    return false;
  }
  return undefined;
}

function parsePositiveNumber(value: string | null): number | undefined {
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.floor(parsed);
  }
  return undefined;
}

function parseInteger(value: string | null): number | undefined {
  if (value === null || value.trim() === "") {
    return undefined;
  }
  const parsed = Number(value);
  if (Number.isFinite(parsed) && parsed >= 0) {
    return Math.floor(parsed);
  }
  return undefined;
}

/**
 * GET /api/nodes
 *
 * 查询参数：
 * - urgency: critical | warning | safe - 按紧急度过滤
 * - hasMatch: true | false - 是否有关联比赛
 * - isOnline: true | false - 是否在线
 * - typeId: number - 按站点类型过滤
 * - solarSystem: number - 按星系过滤
 * - limit: number - 返回数量限制
 * - refresh: true | false - 强制从链上刷新数据
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const filters: NodeFilters = {
    urgency: parseUrgency(searchParams.get("urgency")),
    hasMatch: parseBoolean(searchParams.get("hasMatch")),
    isOnline: parseBoolean(searchParams.get("isOnline")),
    typeId: parsePositiveNumber(searchParams.get("typeId")),
    solarSystem: parseInteger(searchParams.get("solarSystem")),
    limit: parsePositiveNumber(searchParams.get("limit"))
  };

  const forceRefresh = parseBoolean(searchParams.get("refresh")) ?? false;

  try {
    const stale = getProjectionRuntimeMeta().nodes.stale;
    return NextResponse.json({
      nodes: await listNodes(filters, { forceRefresh }),
      ...(stale ? { stale } : {})
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load on-chain nodes";

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "CHAIN_SYNC_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
