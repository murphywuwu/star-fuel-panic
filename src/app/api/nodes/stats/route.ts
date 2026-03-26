import { NextResponse } from "next/server";
import { listNodes } from "@/server/nodeRuntime";
import { getProjectionRuntimeMeta } from "@/server/runtimeProjectionStore";

export const dynamic = "force-dynamic";

/**
 * GET /api/nodes/stats
 *
 * 获取节点统计信息
 *
 * 返回：
 * - total: 总节点数
 * - online: 在线节点数
 * - offline: 离线节点数
 * - byUrgency: 按紧急度分组统计
 * - withCoordinates: 有坐标信息的节点数
 * - withMatch: 有关联比赛的节点数
 */
export async function GET() {
  try {
    const allNodes = await listNodes({});

    const stats = {
      total: allNodes.length,
      online: allNodes.filter((n) => n.isOnline).length,
      offline: allNodes.filter((n) => !n.isOnline).length,
      byUrgency: {
        critical: allNodes.filter((n) => n.urgency === "critical").length,
        warning: allNodes.filter((n) => n.urgency === "warning").length,
        safe: allNodes.filter((n) => n.urgency === "safe").length
      },
      byUrgencyOnline: {
        critical: allNodes.filter((n) => n.urgency === "critical" && n.isOnline).length,
        warning: allNodes.filter((n) => n.urgency === "warning" && n.isOnline).length,
        safe: allNodes.filter((n) => n.urgency === "safe" && n.isOnline).length
      },
      withCoordinates: allNodes.filter(
        (n) => n.coordX !== 0 || n.coordY !== 0 || n.coordZ !== 0
      ).length,
      withMatch: allNodes.filter((n) => n.activeMatchId !== null).length,
      avgFillRatio: allNodes.length > 0
        ? allNodes.reduce((sum, n) => sum + n.fillRatio, 0) / allNodes.length
        : 0
    };

    const stale = getProjectionRuntimeMeta().nodes.stale;
    return NextResponse.json(stale ? { stats, stale } : { stats });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to calculate node stats";

    return NextResponse.json(
      {
        ok: false,
        error: {
          code: "STATS_ERROR",
          message
        }
      },
      { status: 500 }
    );
  }
}
