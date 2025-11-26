import { NextResponse } from "next/server"
import { getTreasuryState } from "@/lib/treasury-db"

export async function GET() {
  try {
    const state = getTreasuryState()
    return NextResponse.json(state)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch treasury state" }, { status: 500 })
  }
}
