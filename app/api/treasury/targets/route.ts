import { NextResponse } from "next/server"
import { getTreasuryState, updateTreasuryTargets } from "@/lib/treasury-db"

// GET current treasury targets
export async function GET() {
  try {
    const state = getTreasuryState()
    return NextResponse.json({
      target: state.target,
      pioneerTarget: state.pioneerTarget,
      projectCostUSD: state.projectCostUSD,
      isTargetOpen: state.isTargetOpen,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch targets" }, { status: 500 })
  }
}

// POST update treasury targets (founder only)
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pioneerId, target, pioneerTarget, projectCostUSD, isTargetOpen } = body

    // TODO: Verify pioneerId has founder badge in production
    if (!pioneerId) {
      return NextResponse.json({ error: "Unauthorized - Founder access only" }, { status: 403 })
    }

    const updatedState = updateTreasuryTargets({
      target: target !== undefined ? target : undefined,
      pioneerTarget: pioneerTarget !== undefined ? pioneerTarget : undefined,
      projectCostUSD: projectCostUSD !== undefined ? projectCostUSD : undefined,
      isTargetOpen: isTargetOpen !== undefined ? isTargetOpen : undefined,
    })

    return NextResponse.json({
      message: "Treasury targets updated successfully",
      state: updatedState,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update targets" }, { status: 500 })
  }
}
