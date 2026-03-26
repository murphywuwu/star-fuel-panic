import { NextResponse } from "next/server";
import { querySolarSystems, getSolarSystemStats } from "@/server/solarSystemRuntime";
import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";
import type { SolarSystemFilters } from "@/types/solarSystem";

export const dynamic = "force-dynamic";

function parseNumber(value: string | null): number | undefined {
  if (!value) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseBoolean(value: string | null): boolean | undefined {
  if (value === "true" || value === "1") return true;
  if (value === "false" || value === "0") return false;
  return undefined;
}

/**
 * GET /api/solar-systems
 *
 * 查询参数：
 * - systemId: number - 按星系 ID 精确筛选
 * - namePattern: string - 名称模糊匹配
 * - limit: number - 返回数量限制
 * - offset: number - 偏移量
 * - stats: boolean - 是否返回统计信息
 * - refresh: true | false - 强制刷新 world API 缓存
 *
 * 响应：
 * {
 *   systems: SolarSystem[],
 *   stats?: SolarSystemStats
 * }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const filters: SolarSystemFilters = {
      systemId: parseNumber(searchParams.get("systemId")),
      namePattern: searchParams.get("namePattern") || undefined,
      limit: parseNumber(searchParams.get("limit")),
      offset: parseNumber(searchParams.get("offset"))
    };

    const includeStats = parseBoolean(searchParams.get("stats")) ?? false;
    const forceRefresh = parseBoolean(searchParams.get("refresh")) ?? false;

    const systems = await querySolarSystems(filters, { forceRefresh });
    const stats = await getSolarSystemStats({ forceRefresh });

    const response: {
      systems: typeof systems;
      stats?: Awaited<ReturnType<typeof getSolarSystemStats>>;
      metadata: {
        limit: number | null;
        offset: number;
        total: number;
      };
    } = {
      systems,
      metadata: {
        limit: filters.limit ?? null,
        offset: filters.offset ?? 0,
        total: stats.totalSystems
      }
    };

    if (includeStats) {
      response.stats = stats;
    }

    const stale = getProjectionRuntimeMeta().solarSystems.stale;
    if (stale) {
      return NextResponse.json({ ...response, stale });
    }

    return NextResponse.json(response);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to query solar systems";

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "SOLAR_SYSTEM_QUERY_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
