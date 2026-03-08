import re
import json

# Mimic heuristics pattern
num_pattern = re.compile(r'([-]?\s*(?:(?:[1-9][0-9]{0,1}(?:,[0-9]{2})+|[1-9][0-9]*)(?:,[0-9]{3})*|0)(?:\.[0-9]+)?)')

text = """
Corporate Financial Summary (Rs Cr)
Metric Value (Rs Cr)
Revenue (Yr 2) 485
Revenue (Yr 1) 445
Other Income 7
EBITDA 52
Depreciation 12
Interest Expense 28
Tax 3.5
Share Capital 25
Reserves 70
Long Term Debt 180
Short Term Debt 130
Fixed Assets (Net) 220
Current Assets 185
Current Liabilities 145
Loan Amount Requested 80
Tenure (Months) 12
Collateral Value 120
GSTR-3B Turnover 510
GSTR-2A Purchases 495
Bank Turnover 420
GSTR-1 Filed 508
"""

text_lower = text.lower()

def test_keyword(keyword):
    for match in re.finditer(r'\b' + re.escape(keyword) + r'\b', text_lower):
        start_idx = match.start()
        end_idx = match.end()
        window_end = min(len(text_lower), end_idx + 60)
        post_keyword_text = text[end_idx:window_end]
        
        # Test original
        numbers = num_pattern.findall(post_keyword_text)
        print(f"Original '{keyword}':", numbers)
        
        # Test fixed
        fixed_text = re.sub(r'\(.*?\)', '', post_keyword_text)
        fixed_numbers = num_pattern.findall(fixed_text)
        print(f"Fixed '{keyword}':", fixed_numbers)

test_keyword("revenue")
test_keyword("ebitda")
test_keyword("purchases")

