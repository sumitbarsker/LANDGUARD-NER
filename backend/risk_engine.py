def calculate_risk_score(rainfall, soil_moisture, slope):

    score = 0

    # Rainfall
    if rainfall >= 100:
        score += 40
    elif rainfall >= 60:
        score += 25
    elif rainfall >= 30:
        score += 15

    # Soil Moisture
    if soil_moisture >= 80:
        score += 30
    elif soil_moisture >= 60:
        score += 20
    elif soil_moisture >= 40:
        score += 10

    # Slope
    if slope >= 35:
        score += 30
    elif slope >= 25:
        score += 20
    elif slope >= 15:
        score += 10

    # Risk Level
    if score >= 75:
        level = "Critical"
    elif score >= 50:
        level = "High"
    elif score >= 25:
        level = "Moderate"
    else:
        level = "Low"

    return score, level
