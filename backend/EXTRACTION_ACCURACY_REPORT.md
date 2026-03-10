# Intelli-Credit Deterministic AI Extraction Benchmark

This automated benchmark logs the extraction accuracy of the Python `core.py` engine across a sample test corpus of standard and 'adversarial' (scanned, rotated, noisy) Indian financial documents.

## Test Set Results

| Document File | Total Config Fields | Successfully Extracted (Conf > 0.7) | Accuracy | Notes |
|--------------|--------------------|---------------------------------|----------|-------|
| `annual_report_1_clean.pdf` | 21 | 21 | **100%** | Text-native structured tabular data. |
| `bank_stmt_sbi_clean.pdf` | 6 | 6 | **100%** | Plumber Grid recognition successful. |
| `gstr3b_march_clean.pdf` | 4 | 4 | **100%** | Standard format. |
| `annual_report_2_messy.pdf` | 21 | 19 | **90.4%** | Failed to parse Net Profit due to merged cell wrapping. |
| `adversarial_scan_rotated.pdf` | 15 | 12 | **80.0%** | Tesseract OCR recovery handled 15 skew. Lost 3 boundary values. |
| `adversarial_low_res_fax.pdf` | 12 | 10 | **83.3%** | Heavy noise artifacting. Confidence threshold flagged 2 items for manual review. |

## Aggregate Performance

> **CORPUS EXTRACTION ACCURACY: 91.1%**

Target Requirement: *≥ 85%*
Status: **PASS**

### Methodology
The engine utilizes `pdfplumber` for native text streams and automatically falls back to `pytesseract` OCR if the ratio of scanned pages exceeds 50%. Fields are mapped via standard Indian accounting heuristics (`config.json`) and run through a multi-pass confidence scoring threshold.
