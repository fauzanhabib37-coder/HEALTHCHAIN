from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# ============================================
# AUTH SCHEMAS
# ============================================
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str  # "admin-bpjs", "faskes", "peserta"
    phone_number: Optional[str] = None
    address: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: str
    role: str
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ============================================
# CLAIM SCHEMAS
# ============================================
class ClaimCreate(BaseModel):
    patient_name: str
    service: str
    diagnosis: str
    amount: float
    documents: list[str] = []

class ClaimResponse(BaseModel):
    id: str
    claim_number: str
    patient_id: str
    faskes_id: str
    service_type: str
    status: str
    ai_validation_score: Optional[int]
    fraud_risk_score: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True

# ============================================
# AI VALIDATION SCHEMAS
# ============================================
class DocumentValidationRequest(BaseModel):
    fileName: str
    fileType: str
    fileSize: int

class DocumentValidationResponse(BaseModel):
    fileName: str
    fileType: str
    fileSize: int
    validationScore: int
    status: str
    validations: dict
    extractedData: dict
    timestamp: datetime

# ============================================
# FASKES SCHEMAS
# ============================================
class FaskesResponse(BaseModel):
    id: str
    name: str
    location: str
    device_count: int
    active_beds: int

    class Config:
        from_attributes = True

# ============================================
# DEVICE SCHEMAS
# ============================================
class MedicalDeviceResponse(BaseModel):
    id: str
    name: str
    device_type: str
    status: str
    usage_percent: int
    temperature: float
    last_maintenance: Optional[datetime]

    class Config:
        from_attributes = True

# ============================================
# SENSOR SCHEMAS
# ============================================
class IoTSensorResponse(BaseModel):
    id: str
    location: str
    occupancy_percent: int
    temperature: float
    humidity_percent: int
    status: str
    updated_at: datetime

    class Config:
        from_attributes = True
