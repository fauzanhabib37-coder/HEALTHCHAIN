from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import ALLOWED_ORIGINS
from app.database import Base, engine
from app.routes import auth, claims
from app.models import *  # noqa

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="HealthChain.AI API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(claims.router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "HealthChain.AI FastAPI"}

@app.get("/")
def root():
    return {"message": "HealthChain.AI API", "version": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
