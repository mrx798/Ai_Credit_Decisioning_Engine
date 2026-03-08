# Intelli-Credit | Offline Python PDF Extractor API

This module entirely replaces the external Claude API dependency for the Hacker Earth / IIT Hyderabad Hackathon. It extracts financial metrics from standard Indian Corporate PDFs using deterministic native text parsing (`pdfplumber`), local Optical Character Recognition (`pytesseract`), and keyword coordinate heuristics.

## Tech Stack
-   **FastAPI / Python 3.10**: High-speed asynchronous engine.
-   **pdfplumber**: Native table detection and text grid coordinate mapping.
-   **pytesseract & poppler**: Offline image-to-text conversion for scanned bank statements.

## 1. Quickstart (Docker)
The absolute best way to run this locally for the hackathon demo without polluting your dev machine with Tesseract binaries:

```bash
cd backend
docker build -t intelli-credit-backend .
docker run -p 8000:8000 intelli-credit-backend
```
The API is now live at `http://localhost:8000/docs`.

### Running Locally (Without Docker)
If you prefer a direct local environment:
1. Ensure `Tesseract OCR` and `poppler-utils` are installed on your OS.
2. `pip install -r requirements.txt`
3. `uvicorn api:app --reload`
4. Run `python demo_extract.py` to test the module against a dummy PDF.

## 2. API Endpoints

### `POST /extract`
Accepts `multipart/form-data` with a single `file` (PDF).
Returns a JSON array of the top 3 heuristic matches for core variables.
```json
{
  "ebitda": {
    "value": 52.0,
    "confidence": 0.85,
    "candidates": [
      {
        "raw_match": "52.0",
        "value": 52.0,
        "keyword_found": "ebitda",
        "page_number": 3,
        "snippet": "...the company registered an EBITDA of Rs 52.0 Crores this year..."
      }
    ]
  }
}
```

### `POST /auto_fill_preview`
Helper endpoint! Only returns the absolute best guess mapped to flat UI fields, scrubbing anything under a 70% confidence for manual human review:
```json
{
  "revenue_yr2": 485.0,
  "ebitda": 52.0,
  "net_profit": null, // Confidence < 0.70 (Review needed)
  "total_debt": 180.0
}
```

## 3. Heuristics & Auditability 
Unlike LLMs, this system is 100% auditable. 
- It uses standard Regex to seek keys like "Revenue from operations".
- It pulls the immediate numbers following the match.
- It normalizes "Lakhs" or "Millions" found in the text snippet converting it into absolute `Crores`.
- To tune the engine: **Edit the `config.json` map**. Include new keys without writing any Python.

## 4. Frontend Integration Example (React JS)

In your React application (`App.jsx`), replacing the dummy loader with a live local API hit simply requires a Javascript `FormData` push:

```javascript
const uploadToLocalAPI = async (pdfFile) => {
    const formData = new FormData();
    formData.append("file", pdfFile);

    const res = await fetch("http://localhost:8000/extract", {
        method: "POST", body: formData
    });
    
    const extractionPayload = await res.json();
    console.log("Extracted Data:", extractionPayload);
    
    // Check confidence threshold
    if(extractionPayload.ebitda.confidence > 0.70) {
        setD(prev => ({ ...prev, ebitda: extractionPayload.ebitda.value }));
    } else {
        // Render manual correction UI using: extractionPayload.ebitda.candidates
        alert("Low confidence on EBITDA. Manual verification required!");
    }
}
```
