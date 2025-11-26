import { NextResponse } from "next/server"
import { addContribution, generateCertificateId, generateReceiptHash } from "@/lib/treasury-db"
import type { CivicShare } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pioneerId, amount, region = "alexandria" } = body

    if (!pioneerId || !amount || amount < 1000) {
      return NextResponse.json({ error: "Minimum contribution is 1,000 Pi" }, { status: 400 })
    }

    const certificateId = generateCertificateId()
    const receiptHash = generateReceiptHash(`${pioneerId}-${amount}-${Date.now()}`)

    const share: CivicShare = {
      pioneerId,
      amount,
      shares: Math.floor(amount / 1000),
      region,
      certificateId,
      timestamp: new Date(),
      receiptHash,
    }

    addContribution(share)

    return NextResponse.json({
      success: true,
      certificate: share,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process contribution" }, { status: 500 })
  }
}
