from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import os
import uuid
import shutil

from services.detector import detector


app = FastAPI(
    title="VoxShield AI API",
    version="3.1.0"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# Upload directory
# =========================

UPLOAD_DIR = os.path.join(
    os.path.dirname(__file__),
    "uploads"
)

os.makedirs(UPLOAD_DIR, exist_ok=True)


# =========================
# Root
# =========================

@app.get("/")
def root():
    return {
        "name": "VoxShield AI",
        "message": "AI Voice Detection API is running",
        "version": "3.1.0"
    }


# =========================
# Health
# =========================

@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "detector": "onnx_ready"
    }


# =========================
# Analyze Audio
# =========================

@app.post("/api/analyze")
async def analyze(file: UploadFile = File(...)):

    allowed_extensions = {
        ".wav",
        ".mp3",
        ".m4a",
        ".ogg",
        ".flac",
        ".webm"
    }

    original_filename = file.filename or "audio"

    extension = os.path.splitext(
        original_filename
    )[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {extension}"
        )

    analysis_id = str(uuid.uuid4())

    filepath = os.path.join(
        UPLOAD_DIR,
        f"{analysis_id}{extension}"
    )

    try:

        print("\n================================")
        print("VOXSHIELD ANALYSIS STARTED")
        print("File:", original_filename)
        print("Analysis ID:", analysis_id)
        print("================================")

        # Save uploaded audio temporarily
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        print("Audio saved:", filepath)

        # Run ONNX detector
        result = detector.predict(filepath)

        print("\nMODEL RESULT:")
        print(result)

        response = {
            "analysis_id": analysis_id,
            "filename": original_filename,
            "type": "audio_analysis",

            "verdict": result["verdict"],

            "ai_probability": result["ai_probability"],
            "real_probability": result["real_probability"],

            "confidence": result["confidence"],

            "duration": result["duration"]
        }

        print("\nVOXSHIELD RESPONSE:")
        print(response)

        return response

    except Exception as e:

        print("\n================================")
        print("ANALYSIS ERROR")
        print("================================")
        print(repr(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:

        # Delete temporary audio
        if os.path.exists(filepath):

            os.remove(filepath)

            print(
                "Temporary audio deleted."
            )