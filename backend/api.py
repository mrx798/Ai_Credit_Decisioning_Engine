from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import uuid
import logging

from intelli_pdf_extractor.core import extract_financials, get_raw_text

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

app = FastAPI(title="Intelli-Credit Offline PDF Extractor")

# Allow Frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "/tmp/intelli_uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

from typing import Dict

@app.post("/extract", response_model=Dict[str, dict])
async def extract_pdf_data(file: UploadFile = File(...)):
    """
    Accepts a PDF file upload and runs the local Python OCR and text extraction engine.
    Returns calculated financial fields with confidence scores and top-3 candidates.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    file_id = str(uuid.uuid4())
    temp_path = os.path.join(UPLOAD_DIR, f"{file_id}_{file.filename}")
    
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        logger.info(f"Received file for extraction: {file.filename}")
        
        # Call core module
        results = extract_financials(temp_path)
        return results
        
    except Exception as e:
        logger.error(f"Failed to extract {file.filename}: {e}")
        raise HTTPException(status_code=500, detail=f"Extraction Engine Error: {str(e)}")
    finally:
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/raw_text")
async def retrieve_raw_text(file: UploadFile = File(...)):
    """
    Returns the parsed text page by page (native or OCR) for frontend highlighting fallbacks.
    """
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
        
    temp_path = os.path.join(UPLOAD_DIR, f"raw_{file.filename}")
    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        return get_raw_text(temp_path)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/auto_fill_preview")
async def auto_fill_preview(file: UploadFile = File(...)):
    """
    Helper route that only returns a flat dictionary of high-confidence values mapped 
    directly to frontend component props for instant autofill.
    """
    results = await extract_pdf_data(file)
    
    preview = {}
    for key, data in results.items():
        if getattr(data, 'confidence', data.get('confidence', 0)) >= 0.7:
             preview[key] = getattr(data, 'value', data.get('value'))
        else:
             preview[key] = None
             
    return preview
