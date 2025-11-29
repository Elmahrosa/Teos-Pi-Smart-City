import { type NextRequest, NextResponse } from "next/server"
import { IoTDatabaseService } from "@/lib/iot-database"

// POST /api/iot/badges/evaluate - Evaluate and auto-award badges for user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId } = body

    if (!userId) {
      return NextResponse.json({ error: "Missing required field: userId" }, { status: 400 })
    }

    const awardedBadges = await IoTDatabaseService.evaluateAndAwardBadges(userId)

    return NextResponse.json({
      success: true,
      awardedBadges,
      count: awardedBadges.length,
      message: `Evaluated and awarded ${awardedBadges.length} badge(s)`,
    })
  } catch (error) {
    console.error("[v0] Error evaluating badges:", error)
    return NextResponse.json({ error: "Failed to evaluate badges" }, { status: 500 })
  }
}
