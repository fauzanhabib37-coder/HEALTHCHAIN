from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from app.database import get_db
from app.models import Claim, ClaimStatus, Faskes
from app.schemas import ClaimCreate, ClaimResponse, DocumentValidationResponse
import uuid

router = APIRouter(prefix="/api", tags=["claims"])

@router.post("/ai/validate-document", response_model=DocumentValidationResponse)
def validate_document(data: dict, db: Session = Depends(get_db)):
    """Mock AI document validation endpoint"""
    # In production, this would call an actual ML model
    validation_score = 85
    return DocumentValidationResponse(
        fileName=data.get("fileName", "document.pdf"),
        fileType=data.get("fileType", "application/pdf"),
        fileSize=data.get("fileSize", 0),
        validationScore=validation_score,
        status="excellent" if validation_score >= 85 else "good" if validation_score >= 70 else "review",
        validations={
            "icdCode": True,
            "resumeMedis": False,
            "signature": True,
            "tanggal": True,
        },
        extractedData={
            "patientName": "Demo Patient",
            "diagnosis": "Contoh Diagnosis",
            "icdCode": "A00",
            "doctorName": "dr. Demo",
            "date": datetime.utcnow().isoformat(),
        },
        timestamp=datetime.utcnow(),
    )

@router.post("/claims/create", response_model=dict)
def create_claim(claim_data: ClaimCreate, db: Session = Depends(get_db)):
    """Create a new claim"""
    # Get first Faskes for demo
    faskes = db.query(Faskes).first()
    if not faskes:
        raise HTTPException(status_code=404, detail="No Faskes found")
    
    claim_number = f"CLM-{datetime.utcnow().strftime('%Y%m%d%H%M%S')}"
    new_claim = Claim(
        claim_number=claim_number,
        patient_id=None,  # In production, get from JWT token
        faskes_id=faskes.id,
        service_type=claim_data.service,
        diagnosis=claim_data.diagnosis,
        amount=claim_data.amount,
        status=ClaimStatus.PROCESSING,
        ai_validation_score=85,
        fraud_risk_score=41,
        documents=claim_data.documents,
    )
    db.add(new_claim)
    db.commit()
    db.refresh(new_claim)
    
    return {
        "success": True,
        "claim": {
            "id": str(new_claim.id),
            "claim_number": new_claim.claim_number,
            "status": new_claim.status.value,
            "ai_validation_score": new_claim.ai_validation_score,
            "fraud_risk_score": new_claim.fraud_risk_score,
            "created_at": new_claim.created_at.isoformat(),
        },
        "message": "Claim created successfully",
    }
