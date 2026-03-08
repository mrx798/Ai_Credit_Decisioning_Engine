import os
import json
import pytest
from fastapi.testclient import TestClient
from api import app
from intelli_pdf_extractor.core import extract_financials
from intelli_pdf_extractor.heuristics import clean_indian_number

client = TestClient(app)

def test_clean_indian_number():
    """Unit test for string-to-float normalization"""
    assert clean_indian_number("₹ 1,500.45") == 1500.45
    assert clean_indian_number("Rs. 10,00,000") == 1000000.0
    assert clean_indian_number("-500") == -500.0
    assert clean_indian_number("INR 12,34,567.89") == 1234567.89

def test_config_loaded():
    """Integration check to ensure JSON heuristic rules are valid"""
    config_path = os.path.join(os.path.dirname(__file__), '..', 'config.json')
    with open(config_path, 'r', encoding='utf-8') as f:
        config = json.load(f)
    assert 'revenue_yr2' in config['fields']
    assert 'ebitda' in config['fields']

# Mock Tests for Endpoints (Requires dummy PDFs in /demo/ to run properly)
def test_extract_endpoint_unsupported_file():
    """Endpoint error handling validation"""
    response = client.post(
        "/extract",
        files={"file": ("test.txt", b"dummy content", "text/plain")}
    )
    assert response.status_code == 400
    assert "Only PDF files are supported" in response.json()["detail"]

def test_raw_text_endpoint_unsupported_file():
    """Endpoint error handling validation"""
    response = client.post(
        "/raw_text",
        files={"file": ("test.png", b"dummy content", "image/png")}
    )
    assert response.status_code == 400
