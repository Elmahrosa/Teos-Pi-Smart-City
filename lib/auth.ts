// Mock authentication - In production, integrate with Pi Network SDK
import type { Pioneer, BadgeType } from "./types"

const MOCK_PIONEER: Pioneer = {
  id: "pioneer-001",
  username: "Ayman Seif",
  piId: "pi-founder-001",
  badges: ["founder"],
  joinedAt: new Date("2007-01-01"),
  signedGovernance: true,
  signingFeePaid: true,
}

export async function getCurrentPioneer(): Promise<Pioneer | null> {
  // In production: integrate with Pi Network authentication
  return MOCK_PIONEER
}

export function hasBadge(pioneer: Pioneer | null, badge: BadgeType): boolean {
  return pioneer?.badges.includes(badge) ?? false
}

export function hasAnyBadge(pioneer: Pioneer | null, badges: BadgeType[]): boolean {
  return badges.some((badge) => hasBadge(pioneer, badge))
}
