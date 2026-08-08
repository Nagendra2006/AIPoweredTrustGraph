import joblib
import pickle
import pandas as pd
import numpy as np
import shap

# -----------------------------
# Load Models
# -----------------------------
xgb_model = joblib.load("xgboost_model.pkl")
isolation_model = joblib.load("isolation_model.pkl")

feature_names = joblib.load("feature_names.pkl")
label_encoders = joblib.load("label_encoders.pkl")
median_values = joblib.load("median_values.pkl")

with open("trust_graph.pkl", "rb") as f:
    trust_graph = pickle.load(f)

explainer = shap.TreeExplainer(xgb_model)


# -----------------------------
# Prediction Function
# -----------------------------
def predict_transaction(transaction):

    # Convert JSON to DataFrame
    df = pd.DataFrame([transaction])

    # Fill missing numeric columns
    for col in median_values.index:
        if col not in df.columns:
            df[col] = median_values[col]

    df = df.fillna(median_values)

    # Encode categorical columns
    for col, encoder in label_encoders.items():

        if col in df.columns:

            df[col] = df[col].astype(str)

            df[col] = df[col].apply(
                lambda x: encoder.transform([x])[0]
                if x in encoder.classes_
                else 0
            )

    # Add missing columns expected by the model
    for col in feature_names:
        if col not in df.columns:
            df[col] = 0

    # Arrange columns in training order
    df = df[feature_names]

    # -----------------------------
    # XGBoost Prediction
    # -----------------------------
    fraud_probability = float(
        xgb_model.predict_proba(df)[0][1]
    )

    # -----------------------------
    # Isolation Forest
    # -----------------------------
    anomaly = isolation_model.predict(df)[0]

    anomaly = "High" if anomaly == -1 else "Normal"

    # -----------------------------
    # SHAP Explanation
    # -----------------------------
    shap_values = explainer.shap_values(df)

    if isinstance(shap_values, list):
        shap_values = shap_values[1]

    importance = np.abs(shap_values[0])

    top_indices = np.argsort(importance)[::-1][:5]

    explanation = []

    for idx in top_indices:
        explanation.append({
            "feature": feature_names[idx],
            "impact": float(importance[idx])
        })

    # -----------------------------
    # GraphSAGE (Placeholder)
    # -----------------------------
    collusion = "Not Implemented"

    # -----------------------------
    # Final Action
    # -----------------------------
    if fraud_probability >= 0.80:
        action = "Hold Payout"

    elif anomaly == "High":
        action = "Manual Review"

    else:
        action = "Approve"

    # Convert the SHAP explanation list to a single comma-separated string for Java compatibility
    explanation_str = ", ".join([f"{item['feature']} ({item['impact']:.2f})" for item in explanation])

    return {
        "riskScore": round(fraud_probability * 100, 2),
        "riskLevel": anomaly,
        "decision": action,
        "explanation": explanation_str
    }


# -----------------------------
# Test
# -----------------------------
if __name__ == "__main__":

    sample = {}

    result = predict_transaction(sample)

    print(result)
    