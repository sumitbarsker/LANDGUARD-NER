from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import pandas as pd
from pathlib import Path

from app.services.risk_engine import calculate_risk_score
from app.services.environmental_service import get_environmental_data


router = APIRouter()


# =====================================================
# MODEL PATH
# =====================================================

BASE_DIR = Path(__file__).resolve().parents[3]

MODEL_PATH = BASE_DIR / "models" / "landslide_model.pkl"

model = joblib.load(MODEL_PATH)


# =====================================================
# INPUT DATA
# =====================================================

class RiskInput(BaseModel):
    state: str
    district: str

    latitude: float
    longitude: float

    material: str = "Unknown"
    movement_type: str = "Unknown"

    # Optional manual environmental values
    rainfall: float = 0
    soil_moisture: float = 0
    slope: float = 0


# =====================================================
# RECOMMENDATION ENGINE
# =====================================================

def get_recommendations(
    risk_level,
    rainfall,
    soil_moisture,
    slope
):

    recommendations = []

    # -------------------------------------------------
    # RISK LEVEL BASED RECOMMENDATIONS
    # -------------------------------------------------

    if risk_level == "Critical":

        recommendations.extend([
            "Immediate monitoring of the vulnerable area is recommended.",
            "Monitor rainfall and soil moisture continuously.",
            "Inspect nearby steep slopes and drainage channels.",
            "Issue an early warning if environmental conditions worsen."
        ])

    elif risk_level == "High":

        recommendations.extend([
            "Increase monitoring frequency.",
            "Inspect vulnerable slopes and drainage systems.",
            "Monitor rainfall and soil moisture closely."
        ])

    elif risk_level == "Moderate":

        recommendations.extend([
            "Periodic monitoring is recommended.",
            "Monitor changes in rainfall and soil moisture.",
            "Inspect vulnerable areas after heavy rainfall."
        ])

    else:

        recommendations.extend([
            "Continue routine monitoring.",
            "Maintain landslide inventory and environmental observations."
        ])

    # -------------------------------------------------
    # RAINFALL BASED RECOMMENDATION
    # -------------------------------------------------

    if rainfall >= 100:

        recommendations.append(
            "Heavy rainfall detected — maintain enhanced monitoring."
        )

    elif rainfall >= 60:

        recommendations.append(
            "Elevated rainfall detected — monitor the area closely."
        )

    # -------------------------------------------------
    # SOIL MOISTURE BASED RECOMMENDATION
    # -------------------------------------------------

    if soil_moisture >= 80:

        recommendations.append(
            "High soil moisture detected — slope stability should be monitored."
        )

    elif soil_moisture >= 60:

        recommendations.append(
            "Elevated soil moisture detected — continue regular monitoring."
        )

    # -------------------------------------------------
    # SLOPE BASED RECOMMENDATION
    # -------------------------------------------------

    if slope >= 35:

        recommendations.append(
            "Very steep slope detected — prioritize this location for inspection."
        )

    elif slope >= 25:

        recommendations.append(
            "Steep slope detected — monitor slope stability."
        )

    return recommendations


# =====================================================
# RISK API
# =====================================================

@router.post("/risk")
def calculate_risk(data: RiskInput):

    # =================================================
    # ML MODEL INPUT
    # =================================================

    input_data = pd.DataFrame(
        [
            {
                "State": data.state,
                "District": data.district,
                "Latitude": data.latitude,
                "Longitude": data.longitude,
                "Material Involved": data.material,
                "Movement Type": data.movement_type
            }
        ]
    )

    # =================================================
    # ML PREDICTION
    # =================================================

    prediction = model.predict(input_data)[0]

    probability = model.predict_proba(input_data)[0][1]

    ml_score = round(
        probability * 100,
        2
    )

    # =================================================
    # AUTOMATIC ENVIRONMENTAL DATA
    # =================================================

    environmental_data = get_environmental_data(
        data.latitude,
        data.longitude
    )

    rainfall = environmental_data["rainfall"]

    soil_moisture = environmental_data["soil_moisture"]

    slope = environmental_data["slope"]

    # =================================================
    # ENVIRONMENTAL RISK
    # =================================================

    environmental_score, environmental_level = calculate_risk_score(
        rainfall,
        soil_moisture,
        slope
    )

    # =================================================
    # FINAL RISK SCORE
    # =================================================

    risk_score = round(
        (ml_score * 0.70) +
        (environmental_score * 0.30),
        2
    )

    # =================================================
    # FINAL RISK LEVEL
    # =================================================

    if risk_score >= 75:

        risk_level = "Critical"

    elif risk_score >= 50:

        risk_level = "High"

    elif risk_score >= 25:

        risk_level = "Moderate"

    else:

        risk_level = "Low"

    # =================================================
    # MESSAGE
    # =================================================

    if risk_level == "Critical":

        message = "Critical landslide risk detected"

    elif risk_level == "High":

        message = "High landslide risk detected"

    elif risk_level == "Moderate":

        message = "Moderate landslide risk detected"

    else:

        message = "Low landslide risk"

    # =================================================
    # RECOMMENDATIONS
    # =================================================

    recommendations = get_recommendations(
        risk_level,
        rainfall,
        soil_moisture,
        slope
    )

    # =================================================
    # RESPONSE
    # =================================================

    return {

        "prediction": int(prediction),

        "risk_score": risk_score,

        "risk_level": risk_level,

        "message": message,

        "ml_score": ml_score,

        "environmental_score": environmental_score,

        "environmental_level": environmental_level,

        "environmental_data": {

            "rainfall": rainfall,

            "soil_moisture": soil_moisture,

            "slope": slope
        },

        "recommendations": recommendations,

        "location": {

            "state": data.state,

            "district": data.district,

            "latitude": data.latitude,

            "longitude": data.longitude
        }
    }