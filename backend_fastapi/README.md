# FastAPI Backend for HealthChain.AI

A modern FastAPI backend with SQLAlchemy ORM, PostgreSQL/SQLite database support, JWT authentication, and AI integration.

## Quick Setup

### 1. Install Dependencies

```bash
cd backend_fastapi
pip install -r requirements.txt
```

### 2. Create `.env` File

```env
DATABASE_URL=sqlite:///./healthchain.db
SECRET_KEY=your-super-secret-key-change-in-production
```

For PostgreSQL:

```env
DATABASE_URL=postgresql://user:password@localhost/healthchain_ai
```

### 3. Run the Server

```bash
uvicorn app.main:app --reload --port 8000
```

Server will be available at: `http://localhost:8000`
API Docs (Swagger UI): `http://localhost:8000/docs`
ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
backend_fastapi/
├── app/
│   ├── main.py           # FastAPI app entry point
│   ├── config.py         # Configuration settings
│   ├── database.py       # Database setup
│   ├── models.py         # SQLAlchemy models
│   ├── schemas.py        # Pydantic schemas
│   ├── security.py       # JWT & password utilities
│   └── routes/
│       ├── auth.py       # Authentication endpoints
│       └── claims.py     # Claims & AI validation endpoints
├── requirements.txt      # Python dependencies
└── README.md            # This file
```

## Database Models

- **User**: Users with roles (admin-bpjs, faskes, peserta)
- **Faskes**: Healthcare facilities (hospitals, clinics)
- **Claim**: Insurance claims with AI validation
- **MedicalDevice**: IoT medical devices tracking
- **IoTSensor**: Environmental sensors (occupancy, temperature, humidity)
- **AuditLog**: Activity logging

## API Endpoints

### Auth

- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token

### Claims

- `POST /api/ai/validate-document` - AI document validation
- `POST /api/claims/create` - Create new claim

### Health

- `GET /health` - Health check
- `GET /` - API info

## Features

✅ SQLAlchemy ORM with PostgreSQL/SQLite support
✅ JWT Authentication
✅ Password hashing (bcrypt)
✅ Pydantic schema validation
✅ CORS support
✅ Automatic API documentation (Swagger UI)
✅ Database migrations ready (Alembic)

## Next Steps

1. Setup Alembic for database migrations:

   ```bash
   alembic init migrations
   ```

2. Configure PostgreSQL in production

3. Add more routes (devices, sensors, analytics)

4. Implement real AI model integration

5. Deploy to production (AWS, Heroku, DigitalOcean, etc.)
