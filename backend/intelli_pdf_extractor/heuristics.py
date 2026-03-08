import re
import json
import logging
import os
from collections import defaultdict
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

# Load local config
config_path = os.path.join(os.path.dirname(__file__), '..', 'config.json')
with open(config_path, 'r', encoding='utf-8') as f:
    CONFIG = json.load(f)

def clean_indian_number(text_val: str) -> float:
    """
    Strips internal commas, currency symbols, and spaces from Indian formatted numbers
    Returns a clean float.
    """
    text_val = text_val.lower()
    for sym in CONFIG['normalization']['currency_symbols']:
        text_val = text_val.replace(sym, '')
        
    # Remove standard whitespace and non-numeric chars except . and -
    text_val = re.sub(r'[^\d\.\-]', '', text_val)
    try:
        if not text_val: return 0.0
        return float(text_val)
    except ValueError:
        return 0.0

def apply_scale(val: float, context: str) -> float:
    """
    If the context string mentions 'lakhs' or 'millions', normalize the value down/up to standard Crores.
    """
    context = context.lower()
    for word, multiplier in CONFIG['normalization']['scales'].items():
        if word in context:
            return val * multiplier
            
    # Auto-scale bare massive numbers into Crores for Indian context if no word is found
    if val > 1000000:
        return val / 10000000.0
        
    return val

def find_candidates(pages: List[Dict], field_name: str, field_config: Dict) -> List[Dict]:
    """
    Heuristics engine:
    Scans pages for keywords associated with the field_name.
    Extracts the nearest numeric value physically/textually close to the keyword.
    """
    candidates = []
    keywords = field_config.get('keywords', [])
    
    # Generic regex to find numbers (supporting commas and decimals)
    num_pattern = re.compile(r'([-]?\s*(?:(?:[1-9][0-9]{0,1}(?:,[0-9]{2})+|[1-9][0-9]*)(?:,[0-9]{3})*|0)(?:\.[0-9]+)?)')

    for p in pages:
        text = p.get('text', '')
        text_lower = text.lower()
        
        for k in keywords:
            # Find all occurrences of the keyword
            for match in re.finditer(r'\b' + re.escape(k) + r'\b', text_lower):
                start_idx = match.start()
                end_idx = match.end()
                
                # Lookahead to find the next number string in the same line/area
                # Grab surrounding context window (+/- 60 chars)
                window_start = max(0, start_idx - 60)
                window_end = min(len(text_lower), end_idx + 60)
                context_snippet = text[window_start:window_end]
                
                # Extract numbers strictly succeeding the keyword in the snippet
                post_keyword_text = text[end_idx:window_end]
                
                # Strip out any parenthetical information (like "(Yr 2)") from the succeeding string to prevent falsely parsing numbers inside them
                cleaned_post_text = re.sub(r'\(.*?\)', '', post_keyword_text)
                numbers = num_pattern.findall(cleaned_post_text)
                
                if numbers:
                    # Take the first immediate number found after the term
                    raw_val = numbers[0]
                    clean_val = clean_indian_number(raw_val)
                    normalized_val = apply_scale(clean_val, context_snippet)
                    
                    candidates.append({
                        "raw_match": raw_val,
                        "value": normalized_val,
                        "keyword_found": k,
                        "page_number": p['page_number'],
                        "snippet": context_snippet.strip().replace('\n', ' ')
                    })
                    
    return candidates
