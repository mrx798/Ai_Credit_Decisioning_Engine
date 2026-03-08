import requests
import json
import os
import sys

# Change this to aim at the localhost API
API_URL = "http://localhost:8000"

def run_extraction_demo(pdf_path: str):
    """
    Demonstrates how to hit the Python Extraction API and process the output 
    specifically for the Intelli-Credit React Frontend.
    """
    print(f"\n[{pdf_path}] -> Initiating offline deterministic extraction...")
    
    if not os.path.exists(pdf_path):
        print(f"Error: Could not find demo PDF at {pdf_path}")
        sys.exit(1)
        
    try:
        # Open file in binary mode
        with open(pdf_path, 'rb') as f:
            files = {'file': (os.path.basename(pdf_path), f, 'application/pdf')}
            
            # Simulated React Frontend POST request
            print(f"   > Uploading to {API_URL}/extract")
            response = requests.post(f"{API_URL}/extract", files=files)
            
            if response.status_code != 200:
                print(f"   ! API Failed: {response.text}")
                return
                
            data = response.json()
            
            print("\n   [EXTRACTION RESULTS]")
            
            # Simulate Frontend Data Assignment & Manual Fallback Check
            for field, result in data.items():
                confidence = result['confidence']
                value = result['value']
                
                if confidence >= 0.7:
                    print(f"   [OK] {field.upper().ljust(22)}: {str(value).rjust(10)} (Conf: {confidence:.2f})")
                else:
                    print(f"   ! {field.upper().ljust(22)}: MANUAL REVIEW REQUIRED (Conf: {confidence:.2f})")
                    print("     Candidates:")
                    for i, cand in enumerate(result['candidates']):
                        print(f"       [{i+1}] {cand['value']} (pg {cand['page_number']}) -> '{cand['snippet'][:40]}...'")
                        
            print("\n   [END DEMO]")
            
    except requests.exceptions.ConnectionError:
        print(f"\n   ! Connection Failed. Is the FastAPI server running at {API_URL}?")
        print("   > Start it using: uvicorn api:app --reload")

if __name__ == "__main__":
    
    # 1. Create a dummy test PDF if none exist to run the script out of the box
    demo_dir = os.path.join(os.path.dirname(__file__), 'demo')
    os.makedirs(demo_dir, exist_ok=True)
    dummy_pdf = os.path.join(demo_dir, "annual_report_demo.pdf")
    
    if not os.path.exists(dummy_pdf):
        print("Creating an empty dummy PDF for execution testing...")
        with open(dummy_pdf, "w") as f:
            f.write("%PDF-1.4\n%EOF")
            
    # 2. Run simulation
    run_extraction_demo(dummy_pdf)
