class IndiaRiskEngine:
    def __init__(self):
        # Current Indian Macro-economic Sector Risk knowledge base
        self.sector_rules = {
            "Steel": {
                "risk_multiplier": 1.25,
                "flags": [
                    "Anti-dumping duty volatility affecting domestic margins",
                    "Global overcapacity risk driven by Chinese surplus exports"
                ]
            },
            "IT": {
                "risk_multiplier": 0.85,
                "flags": [
                    "Rupee appreciation risk eating into export margins",
                    "US tech recession exposure causing client deferred spending"
                ]
            },
            "Real Estate": {
                "risk_multiplier": 1.40,
                "flags": [
                    "Strict RERA compliance monitoring required in operating states",
                    "High inventory overhang in tier-1 metro markets"
                ]
            },
            "NBFC": {
                "risk_multiplier": 1.35,
                "flags": [
                    "Intensified RBI regulatory scrutiny on unsecured lending",
                    "Asset Liability Management (ALM) mismatch vulnerabilities"
                ]
            },
            "Pharma": {
                "risk_multiplier": 1.10,
                "flags": [
                    "Elevated US FDA warning letter risk at key manufacturing sites",
                    "Domestic pricing control (NLEM) margin pressures"
                ]
            },
            "Textiles": {
                "risk_multiplier": 1.20,
                "flags": [
                    "Chinese yarn dumping depressing domestic realisations",
                    "High power and fragmented supply chain costs"
                ]
            }
        }

    def evaluate_risk(self, company_name: str, sector: str, financial_data: dict) -> dict:
        """
        Synthesizes an India-specific macro risk profile simulating real-world 
        central banking (RBI) and taxation (GSTIN) verification endpoints.
        """
        india_risk_score = 100
        regulatory_alerts = []
        
        # 1. Sector-specific macro risks
        sector_data = self.sector_rules.get(sector, {"risk_multiplier": 1.0, "flags": ["Standard operating environment"]})
        india_risk_score -= (sector_data["risk_multiplier"] - 1.0) * 20
        
        # 2. GST Compliance estimation (Revenue vs Declared GST3B)
        revenue = financial_data.get("revenue_yr2", 100)
        gst3b = financial_data.get("gstr_3b_turnover", revenue)
        
        gst_mismatch = (abs(gst3b - revenue) / revenue) * 100 if revenue else 0
        if gst_mismatch > 15:
            regulatory_alerts.append({
                "agency": "GSTIN portal",
                "alert": f"Declared GSTR-3B turnover deviates from Audited Revenue by {gst_mismatch:.1f}%",
                "status": "WARNING"
            })
            india_risk_score -= 15
        else:
            regulatory_alerts.append({
                "agency": "GSTIN portal",
                "alert": "GST Filings reconciled successfully with Audited figures",
                "status": "CLEARED"
            })
            
        # 3. RBI Defaulter List Simulation (Mock CRIF/CIBIL trigger)
        # We trigger a mock alert deterministically based on if "Pvt Ltd" is missing or length 
        name_length = len(company_name)
        if name_length % 7 == 0:  # Arbitrary trigger for demo
            regulatory_alerts.append({
                "agency": "RBI CRILC Database",
                "alert": f"Directorship overlap detected with Historical wilful defaulter entity (2018)",
                "status": "CRITICAL"
            })
            india_risk_score -= 30
        else:
            regulatory_alerts.append({
                "agency": "RBI CRILC Database",
                "alert": "Entity and Promoters cleared against active Defaulter/SMA-2 lists",
                "status": "CLEARED"
            })
            
        # 4. MCA E-Courts Litigation check
        if name_length % 5 == 0:
            regulatory_alerts.append({
                "agency": "E-Courts API",
                "alert": "Pending commercial dispute under NCLT (> ₹1 Cr)",
                "status": "WARNING"
            })
            india_risk_score -= 10
            
        # Floor boundaries
        india_risk_score = max(0, min(100, india_risk_score))

        return {
            "india_risk_score": round(india_risk_score),
            "sector_flags": sector_data["flags"],
            "regulatory_alerts": regulatory_alerts
        }

india_risk_engine = IndiaRiskEngine()
