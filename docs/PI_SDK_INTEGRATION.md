# Pi SDK Integration Guide

## Overview

Teos&Pi Smart City uses the **Pi Browser SDK** (not an npm package) to integrate Pi Network authentication and payments.

## How It Works

The Pi SDK is loaded via a script tag in the app layout and provides a `window.Pi` API that is only available when running inside the Pi Browser.

### Installation

**No npm installation needed.** The SDK is loaded automatically via:

\`\`\`html
<script src="https://sdk.minepi.com/pi-sdk.js" async></script>
\`\`\`

This script is already included in `app/layout.tsx`.

## Authentication

\`\`\`typescript
// lib/pi-auth.ts handles authentication
import { authenticateUser, isPiBrowserAvailable } from '@/lib/pi-auth'

// Check if running in Pi Browser
if (isPiBrowserAvailable()) {
  const user = await authenticateUser()
  console.log('Authenticated user:', user)
}
\`\`\`

## Payments

### Petition Fee (5 Pi)

\`\`\`typescript
import { createPetitionPayment } from '@/lib/pi-payments'

const payment = await createPetitionPayment(userId)
console.log('Payment created:', payment.identifier)
\`\`\`

### Civic Shares (1,000 Pi each)

\`\`\`typescript
import { createCivicSharePayment } from '@/lib/pi-payments'

// Purchase 5 civic shares (5,000 Pi)
const payment = await createCivicSharePayment(userId, 5)
console.log('Civic share payment:', payment)
\`\`\`

## Testing

### Development (Outside Pi Browser)

When testing locally or on Vercel, the app will work without Pi SDK:
- Authentication returns `null`
- Payments return mock payment objects
- All features gracefully degrade

### Production (Inside Pi Browser)

Deploy to Vercel and open in Pi Browser:
1. Download Pi Browser app
2. Navigate to: `https://teos-pi-smart-city.vercel.app`
3. Test authentication and payments

## Environment Variables

No Pi-specific environment variables needed for basic functionality. Optional:

\`\`\`env
NEXT_PUBLIC_PI_SANDBOX=true  # For sandbox testing
NEXT_PUBLIC_PI_APP_ID=teospi-smart-city-elmahrosa
\`\`\`

## Important Notes

- **No npm package**: Do not add `@pi-network/sdk` to package.json
- **Browser only**: Pi SDK only works client-side in Pi Browser
- **Graceful degradation**: App works outside Pi Browser with reduced functionality
- **Server-side**: Use backend API routes to verify payments on your server

## Resources

- Pi Developer Portal: https://develop.pi/
- Pi SDK Documentation: https://github.com/pi-apps/pi-platform-docs
- Pi Mainnet: https://mainnet.pi/

## Troubleshooting

**"Pi SDK not available" in console**
- This is normal outside Pi Browser
- App will use mock data for development

**Payment not working**
- Ensure you're in Pi Browser
- Check console for window.Pi availability
- Verify script loaded: `console.log(window.Pi)`

**Vercel deployment fails**
- Make sure package.json does NOT include `@pi-network/sdk`
- Check build logs for dependency errors
