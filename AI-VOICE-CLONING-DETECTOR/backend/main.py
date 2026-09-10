from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import shutil

app = FastAPI(
    title="VoxShield AI API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.get("/")
def root():
    return {
        "name": "VoxShield",
        "message": "AI Voice Detection API is running",
        "version": "2.0.0"
    }


@app.get("/api/health")
def health():
    return {
        "status": "healthy",
        "detector": "backend_ready"
    }


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

    extension = os.path.splitext(file.filename or "")[1].lower()

    if extension not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported audio format: {extension}"
        )

    analysis_id = str(uuid.uuid4())

    filename = f"{analysis_id}{extension}"
    filepath = os.path.join(UPLOAD_DIR, filename)

    try:
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # TEMPORARY RESPONSE
        # Real ML detector will be connected here next.
        return {
            "analysis_id": analysis_id,
            "filename": file.filename,
            "verdict": "ANALYSIS_PENDING",
            "ai_probability": 0,
            "real_probability": 0,
            "confidence": "PENDING",
            "message": "Audio received successfully"
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        if os.path.exists(filepath):
            os.remove(filepath)