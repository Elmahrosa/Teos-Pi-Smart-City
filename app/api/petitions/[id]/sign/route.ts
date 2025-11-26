import { NextResponse } from "next/server"
import { signPetition } from "@/lib/petition-db"
import { addSigningFee } from "@/lib/treasury-db"
import type { Signature } from "@/lib/types"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { pioneerId } = body

    if (!pioneerId) {
      return NextResponse.json({ error: "Pioneer ID required" }, { status: 400 })
    }

    const signature: Signature = {
      pioneerId,
      timestamp: new Date(),
      piAmount: 5, // 5 Pi signing fee
    }

    const success = signPetition(id, signature)

    if (!success) {
      return NextResponse.json(
        { error: "Failed to sign petition (already signed or petition closed)" },
        { status: 400 },
      )
    }

    // Add signing fee to treasury
    addSigningFee(5)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to sign petition" }, { status: 500 })
  }
}
