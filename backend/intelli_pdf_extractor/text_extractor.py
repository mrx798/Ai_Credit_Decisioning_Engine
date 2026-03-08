import pdfplumber
import logging
from typing import List, Dict

logger = logging.getLogger(__name__)

def extract_text_from_pdf(pdf_path: str) -> List[Dict]:
    """
    Extracts raw text page-by-page from a PDF using pdfplumber.
    Returns: list of dicts: {"page": num, "text": "...", "is_scanned": bool}
    """
    pages_data = []
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                text = page.extract_text(x_tolerance=2, y_tolerance=2) or ""
                
                pages_data.append({
                    "page_number": i + 1,
                    "text": text,
                    "is_scanned": len(text.strip()) < 50
                })
                
        logger.info(f"Successfully extracted {len(pages_data)} pages from {pdf_path}")
    except Exception as e:
        logger.error(f"Error reading PDF text {pdf_path}: {e}")
        
    return pages_data
