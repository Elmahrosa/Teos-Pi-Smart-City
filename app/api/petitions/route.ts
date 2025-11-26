import { NextResponse } from "next/server"
import { getAllPetitions, createPetition } from "@/lib/petition-db"

export async function GET() {
  try {
    const petitions = getAllPetitions()
    return NextResponse.json(petitions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch petitions" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, category, createdBy, requiredSignatures = 100 } = body

    if (!title || !description || !createdBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const petition = createPetition({
      title,
      description,
      category,
      createdBy,
      createdAt: new Date(),
      requiredSignatures,
    })

    return NextResponse.json(petition)
  } catch (error) {
    return NextResponse.json({ error: "Failed to create petition" }, { status: 500 })
  }
}
