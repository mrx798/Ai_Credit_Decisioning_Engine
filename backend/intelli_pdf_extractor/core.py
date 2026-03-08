import json
import logging
import os
from collections import defaultdict
from typing import Dict, Any

from .text_extractor import extract_text_from_pdf
from .ocr import ocr_pdf
from .table_parser import parse_bank_statement
from .heuristics import find_candidates
from .confidence import score_candidates

logger = logging.getLogger(__name__)

config_path = os.path.join(os.path.dirname(__file__), '..', 'config.json')
with open(config_path, 'r', encoding='utf-8') as f:
    CONFIG = json.load(f)

def extract_financials(pdf_path: str) -> Dict[str, Any]:
    """
    Main orchestrator for Intelli-Credit PDF Data Extraction.
    """
    logger.info(f"Starting extraction for {pdf_path}")
    
    # 1. Native Extraction
    pages = extract_text_from_pdf(pdf_path)
    
    # 2. OCR Fallback (If document is mostly images/scanned)
    is_scanned = len(pages) == 0 or sum(1 for p in pages if p['is_scanned']) > (len(pages) * 0.5)
    if is_scanned:
        logger.info("Native extraction yielded scarce text. Falling back to OCR...")
        ocr_pages = ocr_pdf(pdf_path)
        
        # Merge OCR text into pages
        for i, ocr_p in enumerate(ocr_pages):
            if i < len(pages):
                pages[i]['text'] += "\n" + ocr_p['text']
            else:
                pages.append(ocr_p)
                
    results = {}
    
    # 3. Field Extraction Loop based on Configured Heuristics
    for field_name, field_config in CONFIG['fields'].items():
        candidates = find_candidates(pages, field_name, field_config)
        scored_candidates = score_candidates(candidates)
        
        # Take Top 3 Candidates
        top_3 = scored_candidates[:3]
        
        # Only populate the primary value if we have a high confidence match
        primary_val = top_3[0]['value'] if (top_3 and top_3[0]['confidence'] >= 0.7) else None
        
        results[field_name] = {
            "value": primary_val,
            "confidence": top_3[0]['confidence'] if top_3 else 0.0,
            "candidates": top_3
        }
        
    # 4. Special Case: Bank Statements (Table Parsing)
    # If the document looks like a bank statement, parse the tables for monthly credits
    doc_text = " ".join([p.get('text', '').lower() for p in pages])
    if "statement of account" in doc_text or "bank statement" in doc_text:
        monthly_credits = parse_bank_statement(pdf_path)
        results['monthly_bank_credits'] = {
            "value": monthly_credits,
            "confidence": 0.85 if monthly_credits else 0.0,
            "candidates": []
        }
    else:
        results['monthly_bank_credits'] = {"value": [], "confidence": 0.0, "candidates": []}
        
    logger.info(f"Extraction complete for {pdf_path}")
    return results

def get_raw_text(pdf_path: str) -> Dict[str, Any]:
    """ Returns paginated raw text for UI highlighting. """
    pages = extract_text_from_pdf(pdf_path)
    
    if not pages or all(p['is_scanned'] for p in pages):
        pages = ocr_pdf(pdf_path)
        
    return {"pages": pages}
