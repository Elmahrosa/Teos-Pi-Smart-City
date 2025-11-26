// Core types for Teos&Pi Smart City Elmahrosa

export type BadgeType = "citizen" | "merchant" | "auditor" | "officer" | "student" | "contributor" | "founder"

export interface Pioneer {
  id: string
  username: string
  piId: string // Pi Network ID
  badges: BadgeType[]
  joinedAt: Date
  signedGovernance: boolean
  signingFeePaid: boolean // 5 Pi
}

export interface CivicShare {
  pioneerId: string
  amount: number // Amount in Pi
  shares: number // amount / 1000
  region: "alexandria" | "borg-el-arab" | "new-alexandria" | "nac"
  certificateId: string
  timestamp: Date
  receiptHash: string
}

export interface TreasuryState {
  totalPi: number
  totalShares: number
  totalPioneers: number
  target: number | null // Open target - can be set by founder or null for unlimited
  pioneerTarget: number | null // Target number of pioneers or null for open
  projectCostUSD: {
    min: number | null
    max: number | null
  }
  signingFees: number
  contributions: number
  isTargetOpen: boolean // true = no fixed target, false = has specific target
}

export interface Petition {
  id: string
  title: string
  description: string
  category: string
  createdBy: string
  createdAt: Date
  signatures: Signature[]
  status: "open" | "closed" | "approved" | "rejected"
  requiredSignatures: number
}

export interface Signature {
  pioneerId: string
  timestamp: Date
  piAmount: number // 5 Pi signing fee
}
