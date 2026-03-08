import pytesseract
from pdf2image import convert_from_path
from PIL import Image
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

def ocr_pdf(pdf_path: str, lang: str = 'eng') -> List[Dict]:
    """
    Fallback method: Converts PDF to images and runs Tesseract OCR.
    Used when native text extraction yields empty results (scanned documents).
    """
    pages_data = []
    
    try:
        # Convert PDF pages to PIL images (requires poppler-utils installed on system)
        images = convert_from_path(pdf_path, dpi=300)
        
        for i, img in enumerate(images):
            # Run pytesseract on the PIL image
            text = pytesseract.image_to_string(img, lang=lang)
            
            # Simple heuristic for OCR confidence based on text length/density
            confidence = min(1.0, len(text.strip()) / 500.0) if text.strip() else 0.0
            
            pages_data.append({
                "page_number": i + 1,
                "text": text,
                "is_scanned": True,
                "ocr_confidence": round(confidence, 2)
            })
            
        logger.info(f"Successfully OCR'd {len(pages_data)} pages from {pdf_path}")
    except Exception as e:
        logger.error(f"OCR failed for {pdf_path}. Ensure Tesseract and Poppler are installed. Error: {e}")
        
    return pages_data
