import subprocess
import time
import os
import sys

def verify_integration():
    env = os.environ.copy()
    
    # Start the fast API server
    print("Starting Uvicorn Server...")
    server = subprocess.Popen([sys.executable, "-m", "uvicorn", "api:app", "--host", "127.0.0.1", "--port", "8000"], env=env)
    
    time.sleep(10) # Let it spin up
    
    print("Running Demo Extractor against Dummy PDFs...")
    try:
        import demo_extract
        demo_extract.run_extraction_demo("demo/annual_report_demo.pdf")
        demo_extract.run_extraction_demo("demo/bank_statement_demo.pdf")
    except Exception as e:
        print(f"Error executing python demo: {e}")
    finally:
        print("Integration Complete. Shutting down Uvicorn...")
        server.terminate()

if __name__ == "__main__":
    verify_integration()
