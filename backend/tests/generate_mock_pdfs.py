import os
from reportlab.pdfgen import canvas

def create_dummy():
    demo_dir = os.path.join(os.path.dirname(__file__), '..', 'demo')
    os.makedirs(demo_dir, exist_ok=True)
    
    # 1. Annual Report
    c = canvas.Canvas(os.path.join(demo_dir, "annual_report_demo.pdf"))
    c.drawString(100, 750, "BHARAT TEXTILES PVT LTD")
    c.drawString(100, 700, "Revenue from operations: INR 485,00,00,000")
    c.drawString(100, 680, "EBITDA: Rs 52 Lakhs") # Trigger scaling logic
    c.drawString(100, 660, "Profit after tax (PAT) - 15.6 crs")
    c.drawString(100, 640, "Total Debt (Long term borrowings): 2,00,00,000")
    c.save()
    
    # 2. Bank Statement (Mocked as a Table so pdfplumber detects it natively)
    c2 = canvas.Canvas(os.path.join(demo_dir, "bank_statement_demo.pdf"))
    c2.drawString(100, 750, "STATE BANK OF INDIA - STATEMENT OF ACCOUNT")
    
    # Simple drawn grid lines to trick pdfplumber into parsing it as a Table
    y = 700
    for i in range(5):
        c2.line(100, y - (i * 20), 500, y - (i * 20)) # horizontal
        
    for x in [100, 160, 240, 280, 340, 420, 500]:
        c2.line(x, 700, x, 620) # vertical
        
    c2.drawString(105, 685, "Date")
    c2.drawString(165, 685, "Narration")
    c2.drawString(285, 685, "Value Date")
    c2.drawString(345, 685, "Withdrawal")
    c2.drawString(425, 685, "Deposit")
    
    c2.drawString(105, 665, "01/08/2023")
    c2.drawString(165, 665, "TO TRF")
    c2.drawString(285, 665, "01/08/2023")
    c2.drawString(345, 665, "1,500.00")
    c2.drawString(425, 665, " ")
    
    c2.drawString(105, 645, "15/08/2023")
    c2.drawString(165, 645, "NEFT INWARD")
    c2.drawString(285, 645, "15/08/2023")
    c2.drawString(345, 645, " ")
    c2.drawString(425, 645, "35,000.00")
    
    c2.drawString(105, 625, "20/08/2023")
    c2.drawString(165, 625, "NEFT INWARD")
    c2.drawString(285, 625, "20/08/2023")
    c2.drawString(345, 625, " ")
    c2.drawString(425, 625, "85,600.00")
    
    c2.save()

if __name__ == "__main__":
    create_dummy()
    print("Dummy PDFs built in /demo directory.")
