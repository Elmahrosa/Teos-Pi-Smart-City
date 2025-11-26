// In-memory treasury database (replace with real DB in production)
import type { CivicShare, TreasuryState } from "./types"

const treasuryState: TreasuryState = {
  totalPi: 0,
  totalShares: 0,
  totalPioneers: 0,
  target: null,
  pioneerTarget: null,
  projectCostUSD: {
    min: null,
    max: null,
  },
  signingFees: 0,
  contributions: 0,
  isTargetOpen: true,
}

const civicShares: CivicShare[] = []

export function getTreasuryState(): TreasuryState {
  return { ...treasuryState }
}

export function updateTreasuryTargets(updates: {
  target?: number | null
  pioneerTarget?: number | null
  projectCostUSD?: { min: number | null; max: number | null }
  isTargetOpen?: boolean
}): TreasuryState {
  if (updates.target !== undefined) treasuryState.target = updates.target
  if (updates.pioneerTarget !== undefined) treasuryState.pioneerTarget = updates.pioneerTarget
  if (updates.projectCostUSD !== undefined) treasuryState.projectCostUSD = updates.projectCostUSD
  if (updates.isTargetOpen !== undefined) treasuryState.isTargetOpen = updates.isTargetOpen

  return getTreasuryState()
}

export function addContribution(share: CivicShare): void {
  civicShares.push(share)
  treasuryState.totalPi += share.amount
  treasuryState.totalShares += share.shares
  treasuryState.contributions += share.amount

  const uniquePioneers = new Set(civicShares.map((s) => s.pioneerId))
  treasuryState.totalPioneers = uniquePioneers.size
}

export function addSigningFee(amount: number): void {
  treasuryState.signingFees += amount
  treasuryState.totalPi += amount
}

export function getCivicShares(pioneerId?: string): CivicShare[] {
  if (pioneerId) {
    return civicShares.filter((s) => s.pioneerId === pioneerId)
  }
  return [...civicShares]
}

export function generateCertificateId(): string {
  return `CERT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
}

export function generateReceiptHash(data: string): string {
  // Simple hash for demo - use proper crypto in production
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    hash = (hash << 5) - hash + data.charCodeAt(i)
    hash = hash & hash
  }
  return `0x${Math.abs(hash).toString(16).padStart(64, "0")}`
}
