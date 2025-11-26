// In-memory petition database (replace with real DB in production)
import type { Petition, Signature } from "./types"

const petitions: Petition[] = [
  {
    id: "petition-001",
    title: "Approve Land Acquisition in Alexandria Downtown",
    description:
      "Petition to approve the acquisition of 110 acres (445,000 m²) in Alexandria downtown for the Teos&Pi Smart City project.",
    category: "governance",
    createdBy: "pioneer-001",
    createdAt: new Date("2025-01-15"),
    signatures: [],
    status: "open",
    requiredSignatures: 100,
  },
]

export function getAllPetitions(): Petition[] {
  return [...petitions]
}

export function getPetitionById(id: string): Petition | null {
  return petitions.find((p) => p.id === id) ?? null
}

export function createPetition(petition: Omit<Petition, "id" | "signatures" | "status">): Petition {
  const newPetition: Petition = {
    ...petition,
    id: `petition-${Date.now()}`,
    signatures: [],
    status: "open",
  }
  petitions.push(newPetition)
  return newPetition
}

export function signPetition(petitionId: string, signature: Signature): boolean {
  const petition = petitions.find((p) => p.id === petitionId)
  if (!petition || petition.status !== "open") {
    return false
  }

  // Check if already signed
  if (petition.signatures.some((s) => s.pioneerId === signature.pioneerId)) {
    return false
  }

  petition.signatures.push(signature)

  // Auto-approve if threshold reached
  if (petition.signatures.length >= petition.requiredSignatures) {
    petition.status = "approved"
  }

  return true
}
