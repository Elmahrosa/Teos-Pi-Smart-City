import { type NextRequest, NextResponse } from "next/server"
import { IoTDatabaseService } from "@/lib/iot-database"

// POST /api/iot/telemetry - Submit sensor reading
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { sensorId, sensorType, value, unit, locationName, locationLat, locationLng } = body

    if (!sensorId || !sensorType || value === undefined || !unit) {
      return NextResponse.json({ error: "Missing required fields: sensorId, sensorType, value, unit" }, { status: 400 })
    }

    const telemetry = await IoTDatabaseService.insertTelemetry({
      sensorId,
      sensorType,
      value,
      unit,
      locationName,
      locationLat,
      locationLng,
    })

    return NextResponse.json({
      success: true,
      telemetry,
      message: "Telemetry data recorded successfully",
    })
  } catch (error) {
    console.error("[v0] Error recording telemetry:", error)
    return NextResponse.json({ error: "Failed to record telemetry data" }, { status: 500 })
  }
}

// GET /api/iot/telemetry - Get recent telemetry data
export async function GET(request: NextRequest) {
  try {
    const stats = await IoTDatabaseService.getDashboardStats()

    return NextResponse.json({
      success: true,
      stats,
    })
  } catch (error) {
    console.error("[v0] Error fetching telemetry:", error)
    return NextResponse.json({ error: "Failed to fetch telemetry data" }, { status: 500 })
  }
}
