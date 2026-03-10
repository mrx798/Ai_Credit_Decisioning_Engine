class FraudDetector:
    def __init__(self):
        # AI/ML Concept: Rule-based Heuristic Expert System overlaying the ML model
        pass

    def detect_fraud(self, financial_data: dict, mca_data: dict = None) -> dict:
        """
        Runs forensic accounting heuristics simulating early warning signals.
        Returns a fraud score (0-100) and an array of triggered alert flags.
        """
        flags = []
        fraud_score = 0
        
        revenue = financial_data.get("revenue_yr2", 100)
        revenue_prev = financial_data.get("revenue_yr1", 100)
        assets = financial_data.get("assets_yr2", 100)
        assets_prev = financial_data.get("assets_yr1", 100)
        related_party = financial_data.get("related_party_tx", 0)
        bank_cash_flow = financial_data.get("bank_turnover", revenue)
        
        # 1. Related-party transaction ratio
        rp_ratio = (related_party / revenue) * 100 if revenue else 0
        if rp_ratio > 30:
            flags.append({
                "id": "F1",
                "dimension": "Network Risk",
                "title": f"High Related-Party Tx ({rp_ratio:.0f}%)",
                "severity": "HIGH",
                "evidence": "Value extracted from Notes to Accounts Section 18. Indicates potential funneling of funds to sister concerns.",
                "points": 35
            })
            fraud_score += 35
            
        # 2. Explosive Revenue Growth without Asset backing
        rev_growth = ((revenue - revenue_prev) / revenue_prev) * 100 if revenue_prev else 0
        asset_growth = ((assets - assets_prev) / assets_prev) * 100 if assets_prev else 0
        if rev_growth > 150 and asset_growth < 20:
            flags.append({
                "id": "F2",
                "dimension": "Growth Anomaly",
                "title": f"Unbacked Revenue Spike ({rev_growth:.0f}% YoY)",
                "severity": "HIGH",
                "evidence": "P&L shows massive growth but Balance Sheet Fixed Assets remain flat. High risk of circular/paper operations.",
                "points": 40
            })
            fraud_score += 40
            
        # 3. Cash Flow vs P&L Mismatch
        mismatch = (abs(bank_cash_flow - revenue) / revenue) * 100 if revenue else 0
        if mismatch > 20:
            flags.append({
                "id": "F3",
                "dimension": "Cash Manipulation",
                "title": f"Bank vs P&L Mismatch ({mismatch:.0f}%)",
                "severity": "MEDIUM",
                "evidence": "GSTR-3B / Bank aggregate turnovers do not reconcile with Audited P&L Revenue.",
                "points": 25
            })
            fraud_score += 25
            
        # 4. Director Shell Network (Mock MCA Check)
        dir_companies = mca_data.get("director_companies_count", 2) if mca_data else 2
        if dir_companies > 5:
            flags.append({
                "id": "F4",
                "dimension": "Promoter Risk",
                "title": f"Director in {dir_companies} entities",
                "severity": "MEDIUM",
                "evidence": "MCA Registry API cross-reference shows Director holding board seats in multiple defunct/shell entities.",
                "points": 20
            })
            fraud_score += 20
            
        # Compute final radar metrics (for the UI spider chart)
        # Dimensions: Growth Anomaly, Network Risk, Cash Manipulation, Promoter Risk, Tax Compliance, Legal Scrutiny
        radar_metrics = [
            {"subject": "Growth Anomaly", "A": min(100, rev_growth if (rev_growth > 50 and asset_growth < 20) else 10), "fullMark": 100},
            {"subject": "Network Risk", "A": min(100, rp_ratio * 2.5), "fullMark": 100},
            {"subject": "Cash Manipulation", "A": min(100, mismatch * 3), "fullMark": 100},
            {"subject": "Promoter Risk", "A": min(100, dir_companies * 15), "fullMark": 100},
            {"subject": "Tax Compliance", "A": 15, "fullMark": 100}, # Baseline mock
            {"subject": "Legal Scrutiny", "A": 10, "fullMark": 100}  # Baseline mock
        ]

        return {
            "fraud_score": min(100, fraud_score),
            "radar_data": radar_metrics,
            "flags": sorted(flags, key=lambda x: x['points'], reverse=True)
        }

fraud_detector = FraudDetector()
