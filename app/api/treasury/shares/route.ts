import { NextResponse } from "next/server"
import { getCivicShares } from "@/lib/treasury-db"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const pioneerId = searchParams.get("pioneerId")

    const shares = getCivicShares(pioneerId ?? undefined)
    return NextResponse.json(shares)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch civic shares" }, { status: 500 })
  }
}
