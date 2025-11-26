/**
 * Pi Network Authentication Integration
 * Uses the Pi Browser's window.Pi API (loaded via script tag)
 */

declare global {
  interface Window {
    Pi?: {
      authenticate: (
        scopes: string[],
        onIncompletePaymentFound: (payment: any) => void,
      ) => Promise<{
        user: { uid: string; username: string }
        accessToken: string
      }>
      createPayment: (paymentData: any, callbacks: any) => void
    }
  }
}

export async function authenticateUser() {
  if (typeof window === "undefined" || !window.Pi) {
    console.log("[v0] Pi SDK not available - running outside Pi Browser")
    return null
  }

  try {
    const scopes = ["username", "payments"]
    const authResult = await window.Pi.authenticate(scopes, onIncompletePaymentFound)
    return {
      uid: authResult.user.uid,
      username: authResult.user.username,
    }
  } catch (error) {
    console.error("[v0] Pi authentication failed:", error)
    return null
  }
}

function onIncompletePaymentFound(payment: any) {
  console.log("[v0] Incomplete payment found:", payment)
  // Handle incomplete payment - this would be implemented when Pi SDK is fully integrated
}

export function isPiBrowserAvailable(): boolean {
  return typeof window !== "undefined" && !!window.Pi
}
