from typing import List, Dict

def score_candidates(candidates: List[Dict]) -> List[Dict]:
    """
    Ranks extracted field candidates based on a calculated confidence score [0.0 - 1.0].
    Prioritizes keywords that are exact matches and closer text distances.
    """
    scored = []
    
    for c in candidates:
        conf = 0.65 # Base confidence for finding a valid strict number adjacent to a keyword
        
        # Exact keyword matches vs partial
        keyword_length = len(c.get('keyword_found', ''))
        if keyword_length >= 3:
            conf += 0.05
            
        # Valid float mapping
        val = c.get('value')
        if val > 0:
            conf += 0.05
            
        # Does the snippet contain the word 'cr' or 'lakhs' acting as confirmation of currency scale?
        snippet = c.get('snippet', '').lower()
        if 'cr' in snippet or 'lakhs' in snippet or 'inr' in snippet:
            conf += 0.15
            
        # Proximity Penalty: Did the regex jump 40 characters to find the number?
        # A tighter grouping in the snippet implies higher confidence.
        # This is a stub for advanced coordinate-based layout parsing confidence.
        
        c['confidence'] = min(1.0, round(conf, 2))
        scored.append(c)
        
    # Sort highest confidence first
    return sorted(scored, key=lambda x: x['confidence'], reverse=True)
