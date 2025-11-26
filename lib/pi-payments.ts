/**
 * Pi Network Payment Integration
 *
 * Handles all Pi payment flows for Teos&Pi Smart City:
 * - 5 Pi petition fee
 * - 1,000 Pi civic share contributions
 * - Treasury tracking
 */

declare global {
  interface Window {
    Pi?: {
      createPayment: (paymentData: any, callbacks: any) => void
    }
  }
}

type PaymentMetadata = {
  type: "petition" | "civic_share" | "governance"
  userId: string
  timestamp: string
  shares?: number
}

type PaymentResult = {
  identifier: string
  amount: number
  memo: string
  status: "pending" | "completed" | "failed"
}

/**
 * Create petition fee payment (5 Pi)
 */
export async function createPetitionPayment(userId: string): Promise<PaymentResult> {
  if (typeof window === "undefined" || !window.Pi) {
    console.log("[v0] Pi SDK not available - returning mock payment")
    return {
      identifier: `petition_mock_${Date.now()}`,
      amount: 5,
      memo: "Elmahrosa Civic Petition Fee",
      status: "pending",
    }
  }

  return new Promise((resolve, reject) => {
    const paymentData = {
      amount: 5,
      memo: "Elmahrosa Civic Petition Fee",
      metadata: {
        type: "petition",
        userId,
        timestamp: new Date().toISOString(),
      },
    }

    const callbacks = {
      onReadyForServerApproval: (paymentId: string) => {
        console.log("[v0] Payment ready for approval:", paymentId)
        resolve({
          identifier: paymentId,
          amount: 5,
          memo: "Elmahrosa Civic Petition Fee",
          status: "pending",
        })
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        console.log("[v0] Payment ready for completion:", paymentId, txid)
      },
      onCancel: (paymentId: string) => {
        console.log("[v0] Payment cancelled:", paymentId)
        reject(new Error("Payment cancelled"))
      },
      onError: (error: Error, payment: any) => {
        console.error("[v0] Payment error:", error)
        reject(error)
      },
    }

    window.Pi!.createPayment(paymentData, callbacks)
  })
}

/**
 * Create civic share payment (1,000 Pi per share)
 */
export async function createCivicSharePayment(userId: string, shares: number): Promise<PaymentResult> {
  const amount = shares * 1000

  if (typeof window === "undefined" || !window.Pi) {
    console.log("[v0] Pi SDK not available - returning mock payment")
    return {
      identifier: `civic_share_mock_${Date.now()}`,
      amount: amount,
      memo: `Elmahrosa Civic Shares (${shares} shares)`,
      status: "pending",
    }
  }

  return new Promise((resolve, reject) => {
    const paymentData = {
      amount: amount,
      memo: `Elmahrosa Civic Shares (${shares} shares)`,
      metadata: {
        type: "civic_share",
        userId,
        shares,
        timestamp: new Date().toISOString(),
      },
    }

    const callbacks = {
      onReadyForServerApproval: (paymentId: string) => {
        resolve({
          identifier: paymentId,
          amount: amount,
          memo: `Elmahrosa Civic Shares (${shares} shares)`,
          status: "pending",
        })
      },
      onReadyForServerCompletion: (paymentId: string, txid: string) => {
        console.log("[v0] Civic share payment completed:", paymentId, txid)
      },
      onCancel: (paymentId: string) => {
        reject(new Error("Payment cancelled"))
      },
      onError: (error: Error, payment: any) => {
        reject(error)
      },
    }

    window.Pi!.createPayment(paymentData, callbacks)
  })
}

/**
 * Record payment in treasury ledger
 */
export async function recordInTreasury(payment: PaymentResult, metadata: PaymentMetadata): Promise<void> {
  console.log("[v0] Recording payment in treasury:", { payment, metadata })
  // TODO: Implement backend API call to record in database
}
