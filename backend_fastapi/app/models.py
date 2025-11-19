from sqlalchemy import Column, String, Integer, Float, DateTime, ForeignKey, JSON, Enum as SQLEnum, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
import uuid
from datetime import datetime
from app.database import Base
import enum

# ============================================
# ENUMS
# ============================================
class UserRole(str, enum.Enum):
    ADMIN_BPJS = "admin-bpjs"
    FASKES = "faskes"
    PESERTA = "peserta"

class ClaimStatus(str, enum.Enum):
    APPROVED = "approved"
    REJECTED = "rejected"
    PROCESSING = "processing"
    PENDING_REVIEW = "pending_review"

class DeviceStatus(str, enum.Enum):
    ACTIVE = "active"
    MAINTENANCE = "maintenance"
    OFFLINE = "offline"

class SensorStatus(str, enum.Enum):
    ONLINE = "online"
    WARNING = "warning"
    OFFLINE = "offline"

# ============================================
# MODELS
# ============================================
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    phone_number = Column(String(20), nullable=True)
    address = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    claims = relationship("Claim", back_populates="patient")
    audit_logs = relationship("AuditLog", back_populates="user")

class Faskes(Base):
    __tablename__ = "faskes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    location = Column(String(255), nullable=True)
    faskes_type = Column(String(50), default="hospital")
    device_count = Column(Integer, default=0)
    active_beds = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    claims = relationship("Claim", back_populates="faskes")
    devices = relationship("MedicalDevice", back_populates="faskes")
    sensors = relationship("IoTSensor", back_populates="faskes")

class Claim(Base):
    __tablename__ = "claims"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    claim_number = Column(String(50), unique=True, nullable=False, index=True)
    patient_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    faskes_id = Column(UUID(as_uuid=True), ForeignKey("faskes.id"), nullable=False)
    service_type = Column(String(50), nullable=False)
    diagnosis = Column(String(255), nullable=True)
    amount = Column(Float, nullable=True)
    status = Column(SQLEnum(ClaimStatus), default=ClaimStatus.PROCESSING)
    ai_validation_score = Column(Integer, nullable=True)
    fraud_risk_score = Column(Integer, nullable=True)
    validation_data = Column(JSON, nullable=True)
    documents = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    patient = relationship("User", back_populates="claims")
    faskes = relationship("Faskes", back_populates="claims")

class MedicalDevice(Base):
    __tablename__ = "medical_devices"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faskes_id = Column(UUID(as_uuid=True), ForeignKey("faskes.id"), nullable=False)
    name = Column(String(255), nullable=False)
    device_type = Column(String(100), nullable=True)
    status = Column(SQLEnum(DeviceStatus), default=DeviceStatus.ACTIVE)
    usage_percent = Column(Integer, default=0)
    temperature = Column(Float, nullable=True)
    last_maintenance = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    faskes = relationship("Faskes", back_populates="devices")

class IoTSensor(Base):
    __tablename__ = "iot_sensors"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    faskes_id = Column(UUID(as_uuid=True), ForeignKey("faskes.id"), nullable=False)
    location = Column(String(255), nullable=False)
    occupancy_percent = Column(Integer, default=0)
    temperature = Column(Float, nullable=True)
    humidity_percent = Column(Integer, default=0)
    status = Column(SQLEnum(SensorStatus), default=SensorStatus.ONLINE)
    last_reading = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    faskes = relationship("Faskes", back_populates="sensors")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=True)
    resource_id = Column(String(100), nullable=True)
    details = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="audit_logs")
