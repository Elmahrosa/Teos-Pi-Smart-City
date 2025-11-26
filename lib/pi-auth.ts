import PiNetwork from "@pi-network/sdk"

const pi = new PiNetwork({
  version: "2.0",
  sandbox: process.env.NEXT_PUBLIC_PI_SANDBOX === "true",
})

export async function authenticateUser() {
  const scopes = ["username", "payments"]
  const authResult = await pi.authenticate(scopes, onIncompletePaymentFound)
  return {
    uid: authResult.user.uid,
    username: authResult.user.username,
  }
}

function onIncompletePaymentFound(payment: any) {
  console.log("Incomplete payment found:", payment)
  return pi.completePayment(payment.identifier)
}
