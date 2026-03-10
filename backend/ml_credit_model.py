import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
import shap
import json

class CreditScoreModel:
    def __init__(self):
        # AI/ML Setup: Scikit-learn Random Forest
        self.model = RandomForestRegressor(n_estimators=100, random_state=42, max_depth=6)
        self.features = [
            'revenue_growth',
            'ebitda_margin',
            'debt_equity',
            'current_ratio',
            'interest_coverage',
            'sector_risk_multiplier'
        ]
        self._train_mock_model()
        
    def _train_mock_model(self):
        """
        AI/ML Concept: Generates realistic Indian SME financial data (synthetic)
        to train the predictive credit risk model. 
        In production, this would be replaced with actual historical loan default data.
        """
        np.random.seed(42)
        n_samples = 2500
        
        # Indian SME typical parameters (simulated)
        rev_growth = np.random.normal(15, 25, n_samples)      # ~15% YoY growth
        ebitda_margin = np.random.normal(12, 10, n_samples)   # ~12% Margin
        debt_equity = np.random.lognormal(0.4, 0.6, n_samples) # ~1.5x D/E
        current_ratio = np.random.normal(1.3, 0.6, n_samples) # ~1.3x CR
        icr = np.random.normal(2.5, 2.0, n_samples)           # ~2.5x ICR
        sector_risk = np.random.uniform(0.8, 1.8, n_samples)  # Sector penalty/bonus
        
        X = pd.DataFrame({
            'revenue_growth': rev_growth,
            'ebitda_margin': ebitda_margin,
            'debt_equity': debt_equity,
            'current_ratio': current_ratio,
            'interest_coverage': icr,
            'sector_risk_multiplier': sector_risk
        })
        
        # Ground Truth Generative Logic (Credit Score 300 - 900 axis)
        base_score = 650
        scores = (base_score +
                  rev_growth * 2.5 +
                  ebitda_margin * 6.0 -
                  debt_equity * 35.0 +
                  (current_ratio - 1.0) * 50.0 +
                  (icr - 1.0) * 20.0 -
                  (sector_risk - 1.0) * 80.0)
        
        # Add irreducible noise to simulate real-world variance
        scores += np.random.normal(0, 15, n_samples)
        
        # Clip to valid range
        y = np.clip(scores, 300, 900)
        
        # Train ML Model
        self.model.fit(X, y)
        
        # AI/ML Explainability: SHAP (SHapley Additive exPlanations)
        self.explainer = shap.TreeExplainer(self.model)

    def _get_risk_grade(self, score):
        if score >= 800: return "AAA"
        if score >= 750: return "AA"
        if score >= 700: return "A"
        if score >= 650: return "BBB"
        if score >= 600: return "BB"
        if score >= 550: return "B"
        if score >= 500: return "CCC"
        return "D"

    def _get_pd(self, score):
        """
        AI/ML Concept: Probability of Default (PD) translation function.
        Curve flattens exponentially as we approach prime scores (900).
        """
        pd = 100 * np.exp(-0.0075 * (score - 300))
        return min(max(pd, 0.05), 99.0)

    def predict(self, input_data: dict) -> dict:
        """
        Generates the credit decision and explains it using SHAP values.
        """
        # Create a 1-row DataFrame enforcing proper feature order
        df = pd.DataFrame([input_data])[self.features]
        score = self.model.predict(df)[0]
        
        # Compute exact SHAP values for THIS specific inference
        shap_values = self.explainer.shap_values(df)[0]
        
        feature_labels = {
            'revenue_growth': 'Revenue Growth (YoY)',
            'ebitda_margin': 'EBITDA Margin',
            'debt_equity': 'Debt / Equity Ratio',
            'current_ratio': 'Current Ratio',
            'interest_coverage': 'Interest Coverage Ratio',
            'sector_risk_multiplier': 'Sector Risk (Macro)'
        }
        
        # Format SHAP dependencies for the React Waterfall Dashboard
        shap_list = []
        for i, feature in enumerate(self.features):
            impact = shap_values[i]
            shap_list.append({
                "feature": feature_labels[feature],
                "impact": float(impact),
                "is_positive": impact > 0
            })
            
        # Sort by largest magnitude of impact
        shap_list.sort(key=lambda x: abs(x['impact']), reverse=True)
        
        return {
            "credit_score": int(score),
            "risk_grade": self._get_risk_grade(score),
            "probability_of_default": round(self._get_pd(score), 2),
            "shap_values": shap_list
        }

# Global singleton to keep the model in memory
credit_model = CreditScoreModel()
