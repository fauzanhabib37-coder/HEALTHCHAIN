# HealthChain.AI - API Documentation

## Base URL
```
https://{projectId}.supabase.co/functions/v1/make-server-c613b596
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer {access_token}
```

For public endpoints, use the public anon key:
```
Authorization: Bearer {publicAnonKey}
```

---

## 🔐 Authentication Endpoints

### POST /auth/signup
Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name",
  "role": "admin-bpjs" | "faskes" | "peserta",
  "phoneNumber": "081234567890",
  "address": "User Address",
  "faskes": "RS Name" (optional, for faskes/peserta roles)
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name",
    "role": "peserta"
  }
}
```

### POST /auth/login
Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "access_token": "jwt_token_here",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "peserta",
    "name": "User Name",
    "profile": { ... }
  }
}
```

---

## 📋 Claims Management Endpoints

### POST /claims/create
Create a new claim. **Requires Authentication**

**Request Body:**
```json
{
  "patientName": "Ahmad Wijaya",
  "service": "Rawat Inap",
  "diagnosis": "Demam Berdarah Dengue",
  "amount": "Rp 4.500.000",
  "documents": ["doc1.pdf", "doc2.pdf"],
  "faskesId": "uuid" (optional)
}
```

**Response:**
```json
{
  "success": true,
  "claim": {
    "id": "CLM-2024-1234",
    "patientName": "Ahmad Wijaya",
    "service": "Rawat Inap",
    "diagnosis": "Demam Berdarah Dengue",
    "amount": "Rp 4.500.000",
    "status": "approved" | "processing" | "pending_review",
    "aiScore": 95,
    "fraudRiskScore": 15,
    "createdAt": "2024-11-15T10:00:00Z",
    "updatedAt": "2024-11-15T10:00:00Z"
  },
  "message": "Claim created successfully"
}
```

### GET /claims/:claimId
Get claim details by ID. **Requires Authentication**

**Response:**
```json
{
  "success": true,
  "claim": { ... }
}
```

### GET /claims/user/:userId
Get all claims for a specific user. **Requires Authentication**

**Response:**
```json
{
  "success": true,
  "claims": [ ... ]
}
```

### GET /claims
Get all claims (Admin only). **Requires Authentication**

**Response:**
```json
{
  "success": true,
  "claims": [ ... ],
  "total": 1234
}
```

### PUT /claims/:claimId/status
Update claim status. **Requires Authentication**

**Request Body:**
```json
{
  "status": "approved" | "rejected" | "processing",
  "notes": "Optional notes"
}
```

**Response:**
```json
{
  "success": true,
  "claim": { ... }
}
```

---

## 🤖 AI Validation Endpoints

### POST /ai/validate-document
Validate document using AI. **Requires Authentication**

**Request Body:**
```json
{
  "fileName": "resume_medis.pdf",
  "fileType": "application/pdf",
  "fileSize": 1024000
}
```

**Response:**
```json
{
  "success": true,
  "validation": {
    "fileName": "resume_medis.pdf",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "validationScore": 95,
    "status": "excellent" | "good" | "needs_review",
    "validations": {
      "icdCode": true,
      "resumeMedis": true,
      "signature": true,
      "tanggal": false
    },
    "extractedData": {
      "patientName": "Ahmad Wijaya",
      "diagnosis": "Demam Berdarah Dengue",
      "icdCode": "A91",
      "doctorName": "dr. Siti Nurhaliza, Sp.PD",
      "date": "2024-11-15"
    },
    "timestamp": "2024-11-15T10:00:00Z"
  }
}
```

### POST /ai/detect-fraud
Detect fraud in a claim using AI. **Requires Authentication**

**Request Body:**
```json
{
  "claimId": "CLM-2024-1234"
}
```

**Response:**
```json
{
  "success": true,
  "fraudAnalysis": {
    "claimId": "CLM-2024-1234",
    "fraudScore": 85,
    "riskLevel": "high" | "medium" | "low",
    "riskFactors": [
      "Duplicate claim pattern detected",
      "Unusual billing amount for diagnosis"
    ],
    "recommendation": "Immediate investigation required",
    "aiExplanation": "Based on pattern analysis of 15 key indicators...",
    "timestamp": "2024-11-15T10:00:00Z"
  }
}
```

---

## 📡 IoT Monitoring Endpoints

### GET /iot/queue/:faskesId
Get real-time queue data for a faskes. **Requires Authentication**

**Response:**
```json
{
  "success": true,
  "queueData": {
    "faskesId": "uuid",
    "queues": {
      "rawatJalan": 24,
      "igd": 5,
      "pendaftaran": 12
    },
    "sensors": [
      {
        "location": "Ruang Tunggu Poliklinik",
        "occupancy": 78,
        "temperature": 25.2,
        "humidity": 65,
        "status": "online"
      }
    ],
    "lastUpdate": "2024-11-15T10:00:00Z"
  }
}
```

### GET /iot/devices/:faskesId
Get medical devices status for a faskes. **Requires Authentication**

**Response:**
```json
{
  "success": true,
  "devices": [
    {
      "id": "DEV-001",
      "name": "Ventilator ICU-A1",
      "status": "active" | "maintenance" | "offline",
      "usage": 85,
      "temperature": 24.5,
      "lastMaintenance": "2024-10-15"
    }
  ]
}
```

### POST /iot/update-queue
Update queue count. **Requires Authentication**

**Request Body:**
```json
{
  "faskesId": "uuid",
  "queueType": "rawatJalan" | "igd" | "pendaftaran",
  "count": 25
}
```

**Response:**
```json
{
  "success": true,
  "queueData": { ... }
}
```

---

## 🔔 Alerts & Notifications Endpoints

### GET /alerts
Get all alerts for current user. **Requires Authentication**

**Response:**
```json
{
  "success": true,
  "alerts": [
    {
      "id": "ALERT-001",
      "type": "fraud" | "spike" | "system" | "success",
      "severity": "high" | "medium" | "low",
      "message": "Alert message",
      "claimId": "CLM-2024-1234",
      "faskesId": "uuid",
      "timestamp": "2024-11-15T10:00:00Z",
      "read": false
    }
  ]
}
```

### POST /alerts/create
Create a new alert. **Requires Authentication**

**Request Body:**
```json
{
  "type": "fraud",
  "severity": "high",
  "message": "Alert message",
  "claimId": "CLM-2024-1234",
  "faskesId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "alert": { ... }
}
```

---

## 📊 Analytics Endpoints

### GET /analytics/dashboard/:role
Get analytics data for dashboard. **Requires Authentication**

**Parameters:**
- role: "admin-bpjs" | "faskes" | "peserta"

**Response (Admin BPJS):**
```json
{
  "success": true,
  "analytics": {
    "totalClaims": 67234,
    "approvedClaims": 63891,
    "pendingClaims": 2450,
    "rejectedClaims": 893,
    "fraudDetected": 892,
    "totalAmount": 245000000000,
    "avgProcessingTime": 2.4,
    "approvalRate": "95.0"
  }
}
```

**Response (Faskes):**
```json
{
  "success": true,
  "analytics": {
    "totalClaims": 1245,
    "approvedClaims": 1177,
    "avgAiScore": "92.8",
    "currentQueue": 127
  }
}
```

---

## 🏥 Health Check

### GET /health
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "service": "HealthChain.AI API",
  "timestamp": "2024-11-15T10:00:00Z",
  "version": "1.0.0"
}
```

### GET /
Get API information.

**Response:**
```json
{
  "message": "HealthChain.AI API Server",
  "version": "1.0.0",
  "endpoints": {
    "auth": "/auth/signup, /auth/login",
    "claims": "/claims, /claims/:id, /claims/user/:userId",
    "ai": "/ai/validate-document, /ai/detect-fraud",
    "iot": "/iot/queue/:faskesId, /iot/devices/:faskesId",
    "alerts": "/alerts",
    "analytics": "/analytics/dashboard/:role"
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

```json
{
  "error": "Error message description"
}
```

**Common HTTP Status Codes:**
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

---

## Demo Accounts

For testing purposes, use these demo accounts:

**Admin BPJS:**
- Email: admin@bpjs.go.id
- Password: demo123

**Faskes (RS Cipto):**
- Email: admin@rscipto.id
- Password: demo123

**Peserta JKN:**
- Email: peserta@email.com
- Password: demo123

---

## Rate Limiting

Currently no rate limiting is implemented. In production, implement appropriate rate limiting based on your needs.

## CORS

CORS is enabled for all origins. In production, configure specific allowed origins.

## Security Notes

1. Always use HTTPS in production
2. Store JWT tokens securely
3. Implement token refresh mechanism
4. Use environment variables for sensitive data
5. Validate and sanitize all inputs
6. Implement proper role-based access control

---

## Support

For issues or questions, contact: support@healthchain.ai
