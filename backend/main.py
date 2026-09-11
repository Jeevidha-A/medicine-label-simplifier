import json
import os
import shutil
import tempfile
import traceback

from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from auth import get_current_user
from database import Base, engine, get_db
from models import MedicineAnalysis
from services.analysis_service import analyze_medicine


# ---------------------------------------------------------
# Create database tables
# ---------------------------------------------------------
Base.metadata.create_all(bind=engine)


# ---------------------------------------------------------
# Create FastAPI application
# ---------------------------------------------------------
app = FastAPI(
    title="Medicine Label Simplifier API",
    description="AI-powered medicine label analysis and simplification API",
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS configuration
# ---------------------------------------------------------
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173"
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------
# Health check
# ---------------------------------------------------------
@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Medicine Label Simplifier API is running",
    }


# ---------------------------------------------------------
# Analyze medicine label
# ---------------------------------------------------------
@app.post("/api/analyze-medicine")
async def analyze_medicine_endpoint(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    # Check file name
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file was uploaded.",
        )

    # Allowed image formats
    allowed_extensions = {
        ".jpg",
        ".jpeg",
        ".png",
        ".webp",
    }

    extension = os.path.splitext(file.filename)[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=(
                "Invalid file type. "
                "Please upload JPG, JPEG, PNG, or WEBP."
            ),
        )

    temporary_path = None

    try:
        # -------------------------------------------------
        # Save uploaded image temporarily
        # -------------------------------------------------
        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension,
        ) as temp_file:

            temporary_path = temp_file.name

            shutil.copyfileobj(
                file.file,
                temp_file,
            )

        print("\n========================================")
        print("Starting medicine analysis")
        print("User ID:", user_id)
        print("File:", file.filename)
        print("========================================\n")

        # -------------------------------------------------
        # Run complete AI pipeline
        # -------------------------------------------------
        result = analyze_medicine(temporary_path)

        medicine_info = result["medicine_info"]

        # -------------------------------------------------
        # Save result to database
        # -------------------------------------------------
        analysis = MedicineAnalysis(
            user_id=user_id,
            filename=file.filename,

            medicine_name=medicine_info.medicine_name,
            strength=medicine_info.strength,
            form=medicine_info.form,

            ingredients=json.dumps(
                medicine_info.ingredients
            ),

            uses=json.dumps(
                medicine_info.uses
            ),

            directions=json.dumps(
                medicine_info.directions
            ),

            storage=medicine_info.storage,

            warnings=json.dumps(
                medicine_info.warnings
            ),

            simple_explanation=result[
                "simple_explanation"
            ],
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        print("\n========================================")
        print("Medicine analysis successful")
        print("Database ID:", analysis.id)
        print("========================================\n")

        # -------------------------------------------------
        # Return result to React
        # -------------------------------------------------
        return {
            "id": analysis.id,

            "medicine_info": medicine_info.model_dump(),

            "simple_explanation": result[
                "simple_explanation"
            ],
        }

    except HTTPException:
        db.rollback()
        raise

    except Exception as exc:
        db.rollback()

        print("\n========================================")
        print("MEDICINE ANALYSIS ERROR")
        print("========================================")

        traceback.print_exc()

        print("========================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Medicine analysis failed: {exc}",
        )

    finally:
        # -------------------------------------------------
        # Delete temporary uploaded image
        # -------------------------------------------------
        if (
            temporary_path
            and os.path.exists(temporary_path)
        ):
            os.remove(temporary_path)


# ---------------------------------------------------------
# Get logged-in user's analysis history
# ---------------------------------------------------------
@app.get("/api/history")
def get_history(
    db: Session = Depends(get_db),
    user_id: str = Depends(get_current_user),
):
    try:
        records = (
            db.query(MedicineAnalysis)
            .filter(
                MedicineAnalysis.user_id == user_id
            )
            .order_by(
                MedicineAnalysis.created_at.desc()
            )
            .all()
        )

        return {
            "items": [
                {
                    "id": record.id,
                    "filename": record.filename,
                    "medicine_name": record.medicine_name,
                    "strength": record.strength,
                    "form": record.form,
                    "created_at": (
                        record.created_at.isoformat()
                        if record.created_at
                        else None
                    ),
                }
                for record in records
            ]
        }

    except Exception as exc:
        print("\n========================================")
        print("HISTORY ERROR")
        print("========================================")

        traceback.print_exc()

        print("========================================\n")

        raise HTTPException(
            status_code=500,
            detail=f"Failed to load history: {exc}",
        )