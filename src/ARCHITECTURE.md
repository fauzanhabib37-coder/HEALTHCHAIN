# HealthChain.AI - System Architecture Documentation

## 📋 Daftar Isi
1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Database Design](#database-design)
5. [API Architecture](#api-architecture)
6. [Authentication Flow](#authentication-flow)
7. [AI/ML Integration](#aiml-integration)
8. [IoT Integration](#iot-integration)
9. [Security](#security)
10. [Deployment](#deployment)

---

## 📖 Overview

HealthChain.AI adalah platform digital berbasis AI untuk otomasi pengelolaan klaim kesehatan BPJS. Platform ini menghubungkan 3 stakeholder utama:

- **Admin BPJS**: Monitoring nasional, fraud detection, analytics
- **Faskes/Rumah Sakit**: Upload klaim, validasi AI, IoT monitoring
- **Peserta JKN**: Tracking klaim, kartu digital, riwayat medis

### Fitur Utama
✅ AI-powered fraud detection dengan explainability  
✅ Document validation otomatis (OCR + NLP)  
✅ Real-time IoT queue monitoring  
✅ Multi-role dashboard dengan analytics  
✅ Real-time alert system  
✅ Secure authentication (JWT + Supabase Auth)  

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React.js 18+ with TypeScript
- **Styling**: Tailwind CSS v4.0
- **UI Components**: Shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useEffect)
- **Notifications**: Sonner

### Backend
- **Runtime**: Deno (Supabase Edge Functions)
- **Framework**: Hono (lightweight web framework)
- **Database**: Supabase PostgreSQL + KV Store
- **Authentication**: Supabase Auth (JWT)
- **API**: RESTful API

### Infrastructure
- **Hosting**: Supabase Platform
- **CDN**: Supabase Storage (untuk file/images)
- **Real-time**: WebSocket (untuk IoT & notifications)
- **Security**: TLS/HTTPS, JWT, Row Level Security

### AI/ML (Simulated)
Dalam implementasi production, integrasikan:
- **Document OCR**: Tesseract.js / Google Cloud Vision API
- **NLP**: OpenAI GPT-4 / Hugging Face
- **Fraud Detection**: Custom ML model (Python/TensorFlow)
- **LLM Assistant**: OpenAI / Anthropic Claude

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Landing    │  │  Dashboard   │  │  Dashboard   │      │
│  │     Page     │  │     BPJS     │  │    Faskes    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                    ┌──────────────┐                          │
│                    │  Dashboard   │                          │
│                    │   Peserta    │                          │
│                    └──────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                      APPLICATION LAYER                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Components & State                 │  │
│  │  - Authentication State  - Claims Management          │  │
│  │  - IoT Data Handling    - Real-time Updates          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         API LAYER                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         Supabase Edge Functions (Hono Server)         │  │
│  │                                                        │  │
│  │  /auth/*        - Authentication endpoints            │  │
│  │  /claims/*      - Claims management                   │  │
│  │  /ai/*          - AI validation & fraud detection     │  │
│  │  /iot/*         - IoT monitoring data                 │  │
│  │  /alerts/*      - Notifications & alerts              │  │
│  │  /analytics/*   - Dashboard analytics                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                        DATA LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Supabase   │  │   KV Store   │  │  Supabase    │      │
│  │     Auth     │  │  (Key-Value) │  │   Storage    │      │
│  │              │  │              │  │   (Files)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │     AI/ML    │  │     IoT      │  │   Payment    │      │
│  │   Services   │  │   Gateway    │  │   Gateway    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Component Architecture

```
/src
├── /components
│   ���── LandingPage.tsx           # Landing page with marketing
│   ├── LoginPage.tsx             # Authentication UI
│   ├── DashboardBPJS.tsx         # Admin BPJS dashboard
│   ├── DashboardFaskes.tsx       # Faskes/Hospital dashboard
│   ├── DashboardPeserta.tsx      # Patient/Participant dashboard
│   └── /ui                       # Shadcn UI components
│
├── /utils
│   ├── api.ts                    # API client functions
│   └── /supabase
│       └── info.tsx              # Supabase config
│
├── /supabase/functions/server
│   ├── index.tsx                 # Main Hono server
│   ├── seed.tsx                  # Demo data seeding
│   └── kv_store.tsx              # KV store utilities
│
└── App.tsx                       # Main app component
```

---

## 🗄️ Database Design

### Key-Value Store Schema

Platform menggunakan Supabase KV Store dengan struktur key-value:

#### User Data
```
Key: user:{userId}
Value: {
  id: string
  email: string
  name: string
  role: "admin-bpjs" | "faskes" | "peserta"
  phoneNumber: string
  address: string
  faskes: string
  createdAt: timestamp
  status: "active" | "inactive"
}
```

#### Peserta Profile
```
Key: peserta:{userId}
Value: {
  userId: string
  nomorKartu: string
  nik: string
  kelas: "Kelas I" | "Kelas II" | "Kelas III"
  status: "Aktif" | "Tidak Aktif"
  berlakuHingga: string
  faskesPrimer: string
}
```

#### Claims
```
Key: claim:{claimId}
Value: {
  id: string (CLM-YYYY-XXXX)
  patientName: string
  service: string
  diagnosis: string
  amount: string
  faskesId: string
  status: "approved" | "processing" | "pending_review" | "rejected"
  aiScore: number (0-100)
  fraudRiskScore: number (0-100)
  documents: string[]
  createdAt: timestamp
  updatedAt: timestamp
  createdBy: string
  notes?: string
}
```

#### User Claims Index
```
Key: claims:user:{userId}
Value: string[] (array of claimIds)
```

#### IoT Queue Data
```
Key: iot:queue:{faskesId}
Value: {
  faskesId: string
  queues: {
    rawatJalan: number
    igd: number
    pendaftaran: number
  }
  sensors: Array<{
    location: string
    occupancy: number
    temperature: number
    humidity: number
    status: "online" | "offline"
  }>
  lastUpdate: timestamp
}
```

#### IoT Devices
```
Key: iot:devices:{faskesId}
Value: Array<{
  id: string
  name: string
  status: "active" | "maintenance" | "offline"
  usage: number
  temperature: number
  lastMaintenance: string
}>
```

#### Alerts
```
Key: alert:{alertId}
Value: {
  id: string
  type: "fraud" | "spike" | "system" | "success"
  severity: "high" | "medium" | "low"
  message: string
  claimId?: string
  faskesId?: string
  timestamp: timestamp
  read: boolean
}
```

### Entity Relationship Diagram

```
┌──────────────┐        ┌──────────────┐        ┌──────────────┐
│     User     │        │    Claim     │        │    Alert     │
├──────────────┤        ├──────────────┤        ├──────────────┤
│ id (PK)      │───────<│ createdBy    │        │ id (PK)      │
│ email        │        │ faskesId     │        │ type         │
│ name         │        │ patientName  │        │ severity     │
│ role         │        │ service      │        │ message      │
│ phoneNumber  │        │ diagnosis    │        │ claimId (FK) │
│ address      │        │ amount       │        │ timestamp    │
└──────────────┘        │ status       │        └──────────────┘
                        │ aiScore      │
                        │ fraudRiskScore│
                        └──────────────┘
                               │
                               │
                        ┌──────────────┐
                        │   Peserta    │
                        ├──────────────┤
                        │ userId (FK)  │
                        │ nomorKartu   │
                        │ nik          │
                        │ kelas        │
                        │ status       │
                        └──────────────┘
```

---

## 🔌 API Architecture

### RESTful Endpoints

Semua endpoint menggunakan prefix: `/make-server-c613b596`

#### Authentication
- `POST /auth/signup` - Registrasi user baru
- `POST /auth/login` - Login dan dapatkan JWT token

#### Claims Management
- `POST /claims/create` - Buat klaim baru
- `GET /claims/:claimId` - Detail klaim
- `GET /claims/user/:userId` - Klaim per user
- `GET /claims` - Semua klaim (admin only)
- `PUT /claims/:claimId/status` - Update status klaim

#### AI Services
- `POST /ai/validate-document` - Validasi dokumen dengan AI
- `POST /ai/detect-fraud` - Deteksi fraud dengan AI

#### IoT Monitoring
- `GET /iot/queue/:faskesId` - Data antrean real-time
- `GET /iot/devices/:faskesId` - Status perangkat medis
- `POST /iot/update-queue` - Update data antrean

#### Alerts & Notifications
- `GET /alerts` - Ambil semua alert
- `POST /alerts/create` - Buat alert baru

#### Analytics
- `GET /analytics/dashboard/:role` - Data analytics per role

### Request/Response Flow

```
Client Request
     ↓
CORS Middleware
     ↓
Logger Middleware
     ↓
Auth Middleware (if protected route)
     ↓
Route Handler
     ↓
Business Logic
     ↓
KV Store Operations
     ↓
Response Formatting
     ↓
Client Response
```

### Error Handling

Semua error dikembalikan dalam format konsisten:

```typescript
{
  error: string,        // Error message
  status: number        // HTTP status code
}
```

Error logging dilakukan di console untuk debugging.

---

## 🔐 Authentication Flow

### Sign Up Flow

```
1. User submits signup form
   ↓
2. Frontend sends POST /auth/signup
   ↓
3. Server validates input
   ↓
4. Supabase Auth creates user (email confirmed automatically)
   ↓
5. Server stores user profile in KV store
   ↓
6. If peserta role, create peserta-specific data
   ↓
7. Return success response
```

### Login Flow

```
1. User submits login form
   ↓
2. Frontend sends POST /auth/login
   ↓
3. Supabase Auth validates credentials
   ↓
4. Server returns JWT access token + user data
   ↓
5. Frontend stores token in localStorage
   ↓
6. Token used in Authorization header for subsequent requests
   ↓
7. Redirect to appropriate dashboard based on role
```

### Session Management

```typescript
// Token storage
localStorage.setItem('healthchain_token', access_token);
localStorage.setItem('healthchain_user', JSON.stringify(user));

// Token usage
Authorization: Bearer {access_token}

// Token validation (server-side)
const { data: { user }, error } = await supabase.auth.getUser(token);
```

### Role-Based Access Control (RBAC)

```
Admin BPJS:
  - Full access to all claims
  - National analytics & statistics
  - Fraud detection monitoring
  - All faskes monitoring

Faskes:
  - Create & manage own claims
  - IoT monitoring for own facility
  - Document validation
  - Own analytics

Peserta:
  - View own claims only
  - Track claim status
  - Digital card access
  - Medical history
```

---

## 🤖 AI/ML Integration

### 1. Document Validation AI

**Purpose**: Ekstraksi dan validasi otomatis dari dokumen klaim (PDF, gambar)

**Technologies** (untuk implementasi production):
- OCR: Tesseract.js / Google Cloud Vision API
- NLP: OpenAI GPT-4 / spaCy
- Document Classification: Custom CNN model

**Process Flow**:
```
1. Upload document (PDF/Image)
   ↓
2. OCR extraction → raw text
   ↓
3. NLP processing → structured data
   ↓
4. Validation rules check:
   - ICD-10 code validity
   - Resume medis completeness
   - Doctor signature detection
   - Date consistency
   ↓
5. Generate AI validation score (0-100)
   ↓
6. Return structured results + recommendations
```

**Current Implementation** (Simulated):
```typescript
// Returns mock validation with random scores 70-100
const validationScore = Math.floor(Math.random() * 30) + 70;
```

### 2. Fraud Detection AI

**Purpose**: Deteksi otomatis pola fraud dalam klaim

**Technologies** (untuk implementasi production):
- ML Model: Random Forest / XGBoost / Neural Network
- Features: 
  - Claim amount vs diagnosis average
  - Frequency patterns
  - Duplicate detection
  - Billing code analysis
  - Provider history
  - Geographic patterns

**Process Flow**:
```
1. New claim submitted
   ↓
2. Extract features:
   - Amount, diagnosis, provider, date, location
   - Historical patterns
   - Similar claims
   ↓
3. ML model prediction → fraud probability (0-100)
   ↓
4. Rule-based checks (business logic)
   ↓
5. Combine scores → final fraud risk score
   ↓
6. If high risk (>80): Create alert
   ↓
7. Generate explainable AI report
```

**Explainability**:
```typescript
{
  fraudScore: 85,
  riskFactors: [
    "Duplicate claim pattern detected",
    "Unusual billing amount for diagnosis",
    "High frequency from this provider"
  ],
  recommendation: "Immediate investigation required",
  aiExplanation: "Based on pattern analysis of 15 key indicators..."
}
```

### 3. LLM Assistant

**Purpose**: Chat assistant untuk insight dan informasi

**Technologies** (untuk implementasi production):
- OpenAI GPT-4
- Anthropic Claude
- Custom RAG (Retrieval-Augmented Generation)

**Features**:
- Natural language queries tentang klaim
- Analisis trend dan pattern
- Rekomendasi berbasis data
- Prediksi & forecasting

**Example Queries**:
```
User: "Analisis fraud bulan ini"
Assistant: "Berdasarkan data, terdeteksi 892 kasus fraud dengan total nilai Rp 8.2M. 
Peningkatan 12% dari bulan lalu. Top 3 pola: duplicate claims (45%), 
upcoding (30%), phantom billing (25%)."
```

---

## 📡 IoT Integration

### IoT Gateway Architecture

```
┌─────────────────────────────────────────────────────┐
│              Medical Devices & Sensors               │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐       │
│  │ Occupancy │  │Temperature│  │  Medical  │       │
│  │  Sensors  │  │  Sensors  │  │  Devices  │       │
│  └───────────┘  └───────────┘  └───────────┘       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                   IoT Gateway                        │
│  - Data aggregation                                  │
│  - Protocol translation (MQTT, HTTP, CoAP)           │
│  - Local processing & filtering                      │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│              HealthChain.AI Platform                 │
│  - POST /iot/update-queue                            │
│  - Real-time data storage (KV Store)                 │
│  - WebSocket broadcasting to clients                 │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│                  Dashboard UI                        │
│  - Real-time queue visualization                     │
│  - Device status monitoring                          │
│  - Alerts on anomalies                               │
└─────────────────────────────────────────────────────┘
```

### Queue Monitoring

**Data Points**:
- **Rawat Jalan**: Jumlah pasien menunggu
- **IGD**: Pasien di triase/emergency
- **Pendaftaran**: Antrean registrasi

**Sensor Data**:
- Occupancy percentage
- Temperature (°C)
- Humidity (%)
- Status (online/offline)

**Update Frequency**: Real-time (1-5 seconds)

### Medical Devices Monitoring

**Tracked Devices**:
- Ventilators
- MRI/CT Scanners
- X-Ray machines
- Ultrasound devices
- Vital sign monitors

**Monitoring Metrics**:
- Status (active/maintenance/offline)
- Usage percentage
- Temperature
- Last maintenance date
- Error logs

---

## 🔒 Security

### Security Measures Implemented

1. **Authentication & Authorization**
   - JWT-based authentication
   - Supabase Auth integration
   - Role-based access control
   - Session management

2. **Data Protection**
   - TLS/HTTPS encryption
   - Secure token storage
   - Password hashing (Supabase Auth)
   - Environment variables for secrets

3. **API Security**
   - CORS configuration
   - Request validation
   - Rate limiting (recommended for production)
   - Input sanitization

4. **Database Security**
   - Row-level security (RLS) on Supabase
   - Prepared statements (SQL injection prevention)
   - Access control per role

### Security Best Practices for Production

```typescript
// 1. Use environment variables
const API_KEY = Deno.env.get('API_KEY');

// 2. Validate all inputs
function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 3. Sanitize user input
function sanitize(input: string): string {
  return input.replace(/[<>]/g, '');
}

// 4. Use HTTPS only
if (req.protocol !== 'https') {
  return res.redirect('https://' + req.hostname + req.url);
}

// 5. Implement rate limiting
const rateLimit = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
};
```

### Compliance & Privacy

- **GDPR Compliance**: User data deletion on request
- **Data Minimization**: Store only necessary data
- **Audit Logs**: Track all data access
- **Encryption**: End-to-end for sensitive data
- **Anonymization**: For analytics & reporting

---

## 🚀 Deployment

### Supabase Deployment

Platform HealthChain.AI di-host sepenuhnya di Supabase:

1. **Frontend**: Static hosting via Supabase
2. **Backend**: Edge Functions (Deno runtime)
3. **Database**: PostgreSQL + KV Store
4. **Auth**: Supabase Auth
5. **Storage**: Supabase Storage (untuk file uploads)

### Environment Variables

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# External API Keys (for production)
OPENAI_API_KEY=sk-...
GOOGLE_VISION_API_KEY=...
SMTP_HOST=...
SMTP_PORT=...
```

### Deployment Steps

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link project
supabase link --project-ref your-project-ref

# 4. Deploy Edge Functions
supabase functions deploy make-server-c613b596

# 5. Set environment variables
supabase secrets set OPENAI_API_KEY=sk-...

# 6. Run database seeding (optional)
deno run --allow-net --allow-env supabase/functions/server/seed.tsx
```

### CI/CD Pipeline (Recommended)

```yaml
# .github/workflows/deploy.yml
name: Deploy to Supabase

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Supabase CLI
        run: npm install -g supabase
      
      - name: Deploy Functions
        run: supabase functions deploy
        env:
          SUPABASE_ACCESS_TOKEN: ${{ secrets.SUPABASE_ACCESS_TOKEN }}
```

### Monitoring & Logging

```typescript
// Server-side logging
app.use('*', logger(console.log));

// Error tracking
try {
  // operations
} catch (error) {
  console.error('Error context:', error);
  // Send to error tracking service (e.g., Sentry)
}

// Performance monitoring
const startTime = Date.now();
// ... operation ...
const duration = Date.now() - startTime;
console.log(`Operation took ${duration}ms`);
```

### Scaling Considerations

1. **Horizontal Scaling**: Supabase Edge Functions auto-scale
2. **Database Optimization**: 
   - Use indexes on frequently queried fields
   - Implement caching for read-heavy operations
   - Use connection pooling

3. **CDN**: Use Supabase Storage CDN for static assets
4. **Load Balancing**: Handled by Supabase infrastructure
5. **Caching Strategy**: Implement Redis for frequently accessed data

---

## 📊 Performance Optimization

### Frontend Optimization

```typescript
// 1. Code splitting
const DashboardBPJS = lazy(() => import('./components/DashboardBPJS'));

// 2. Memoization
const MemoizedChart = React.memo(ChartComponent);

// 3. Debouncing
const debouncedSearch = debounce(searchFunction, 300);

// 4. Lazy loading images
<img loading="lazy" src="..." />
```

### Backend Optimization

```typescript
// 1. Batch operations
const claims = await kv.mget(claimIds);

// 2. Caching
const cachedData = await cache.get(key);
if (cachedData) return cachedData;

// 3. Parallel requests
const [users, claims, alerts] = await Promise.all([
  getUsers(),
  getClaims(),
  getAlerts()
]);
```

---

## 🧪 Testing Strategy

### Unit Testing
```typescript
// Example: Test claim creation
describe('Claims API', () => {
  it('should create a new claim', async () => {
    const claim = await createClaim(testData);
    expect(claim.id).toMatch(/CLM-2024-\d{4}/);
    expect(claim.status).toBe('processing');
  });
});
```

### Integration Testing
- Test API endpoints
- Test authentication flow
- Test database operations

### E2E Testing
- Test complete user journeys
- Test all 3 role dashboards
- Test claim submission flow

---

## 📞 Support & Maintenance

### Monitoring Checklist
- [ ] API response times
- [ ] Error rates
- [ ] Database performance
- [ ] Authentication failures
- [ ] IoT device connectivity
- [ ] AI model accuracy

### Backup Strategy
- Daily database backups (Supabase automatic)
- Weekly full system backup
- Point-in-time recovery enabled

### Update Schedule
- Security patches: Immediate
- Feature updates: Bi-weekly
- Major versions: Quarterly

---

## 📝 License & Credits

**HealthChain.AI** - Platform AI untuk Healthcare Claims Management

Built with:
- React.js & TypeScript
- Supabase Platform
- Tailwind CSS
- Shadcn/ui

---

## 🔗 Quick Links

- [API Documentation](./API_DOCUMENTATION.md)
- [User Guide](./USER_GUIDE.md)
- [Developer Guide](./DEVELOPER_GUIDE.md)
- [Changelog](./CHANGELOG.md)

---

**Last Updated**: November 2024  
**Version**: 1.0.0
