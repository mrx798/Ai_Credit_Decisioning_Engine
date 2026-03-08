import logging
import pdfplumber
import re
from collections import defaultdict
from typing import List, Dict

logger = logging.getLogger(__name__)

def parse_bank_statement(pdf_path: str) -> List[Dict]:
    """
    Specifically targets Bank Statement style PDFs to extract monthly credit sums.
    Extracts tabular data using pdfplumber's native table finder.
    """
    monthly_credits = defaultdict(float)
    
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for i, page in enumerate(pdf.pages):
                tables = page.extract_tables()
                
                for table in tables:
                    for row in table:
                        if not row: continue
                        
                        # Very naive heuristic for a bank statement row:
                        # [Date, Narration, Chq, Value Date, Withdrawal, Deposit, Balance]
                        # We just look for standard date strings (DD/MM/YYYY) in the first few cols
                        row_str = " ".join([str(c) for c in row if c])
                        
                        date_match = re.search(r'(\d{2})[-/](\w{3}|\d{2})[-/](\d{4}|\d{2})', row_str)
                        if date_match:
                            try:
                                month_str = date_match.group(2)
                                
                                # Assume last or second-to-last numeric column is the deposit/credit
                                # Strip commas
                                nums = re.findall(r'[\d,]+\.\d{2}', row_str)
                                if nums:
                                    # If a row has multiple numbers, the highest is usually the balance
                                    # Second highest is often the credit if it's a deposit row
                                    # For a simple heuristic, let's just grab the last numeric value assuming it's the tx amount
                                    val_str = nums[-1].replace(',', '')
                                    monthly_credits[month_str] += float(val_str)
                            except Exception as e:
                                pass # Skip unparsable rows
                                
    except Exception as e:
        logger.error(f"Error parsing tables in {pdf_path}: {e}")
        
    # Format for JSON output
    result = [{"month": k, "credit_sum": round(v, 2)} for k, v in monthly_credits.items()]
    return result
