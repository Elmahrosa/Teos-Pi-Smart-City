# API Documentation
## Teos&Pi Smart City Elmahrosa

### Base URL

Development: `http://localhost:3000/api`  
Production: `https://teospi-elmahrosa.vercel.app/api`

---

## Treasury Endpoints

### GET /treasury/state

Get current treasury status and statistics.

**Response:**
\`\`\`json
{
  "totalPi": 0,
  "totalShares": 0,
  "totalPioneers": 0,
  "target": 10000000,
  "signingFees": 0,
  "contributions": 0
}
\`\`\`

### POST /treasury/contribute

Contribute Pi and receive civic shares.

**Request Body:**
\`\`\`json
{
  "pioneerId": "string",
  "amount": number,  // Minimum 1000
  "region": "alexandria" | "borg-el-arab" | "new-alexandria" | "nac"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true,
  "certificate": {
    "pioneerId": "string",
    "amount": number,
    "shares": number,
    "region": "string",
    "certificateId": "string",
    "timestamp": "ISO date",
    "receiptHash": "string"
  }
}
\`\`\`

**Errors:**
- `400` - Amount below 1,000 Pi minimum
- `500` - Server error

### GET /treasury/shares

Get civic share certificates.

**Query Parameters:**
- `pioneerId` (optional) - Filter by specific pioneer

**Response:**
\`\`\`json
[
  {
    "pioneerId": "string",
    "amount": number,
    "shares": number,
    "region": "string",
    "certificateId": "string",
    "timestamp": "ISO date",
    "receiptHash": "string"
  }
]
\`\`\`

---

## Petition Endpoints

### GET /petitions

List all petitions.

**Response:**
\`\`\`json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "category": "string",
    "createdBy": "string",
    "createdAt": "ISO date",
    "signatures": [],
    "status": "open" | "closed" | "approved" | "rejected",
    "requiredSignatures": number
  }
]
\`\`\`

### POST /petitions

Create a new petition (requires governance access).

**Request Body:**
\`\`\`json
{
  "title": "string",
  "description": "string",
  "category": "string",
  "createdBy": "string",
  "requiredSignatures": number  // Default: 100
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "string",
  "title": "string",
  // ... full petition object
}
\`\`\`

**Errors:**
- `400` - Missing required fields
- `401` - Unauthorized (no governance access)
- `500` - Server error

### POST /petitions/:id/sign

Sign a petition (5 Pi fee).

**Request Body:**
\`\`\`json
{
  "pioneerId": "string"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

**Errors:**
- `400` - Already signed or petition closed
- `401` - Unauthorized
- `402` - Insufficient Pi balance
- `500` - Server error

---

## Authentication

All authenticated endpoints require:

**Headers:**
\`\`\`
Authorization: Bearer {pi-network-access-token}
\`\`\`

In development, authentication is mocked. In production, integrate with Pi Network SDK.

---

## Rate Limiting

- **General:** 100 requests per minute per IP
- **Treasury:** 10 contributions per hour per pioneer
- **Petitions:** 50 signatures per hour per pioneer

---

## Error Responses

Standard error format:

\`\`\`json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE",
  "details": {}  // Optional
}
\`\`\`

**Common Error Codes:**
- `UNAUTHORIZED` - Missing or invalid authentication
- `FORBIDDEN` - Insufficient permissions (badge required)
- `BAD_REQUEST` - Invalid request parameters
- `NOT_FOUND` - Resource doesn't exist
- `RATE_LIMITED` - Too many requests
- `SERVER_ERROR` - Internal server error

---

## WebSocket Events (Future)

Real-time updates for:
- Treasury contributions
- Petition signatures
- Badge assignments
- Incident logs

Documentation coming in Phase 2.

---

**Last Updated:** January 2025  
**Version:** 1.0
