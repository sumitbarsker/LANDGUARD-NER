# LANDGUARD-NER

## Landslide Risk Monitoring System

LANDGUARD-NER is a web-based landslide risk monitoring and assessment system developed for the North Eastern Region (NER) of India.

The main purpose of this project is to provide a simple way to assess landslide risk for a particular location using Machine Learning and environmental conditions.

The system takes location details and different environmental parameters as input and generates a risk score, risk level and safety recommendations.

---

## About the Project

Landslides can occur due to different factors such as heavy rainfall, high soil moisture and steep slopes. Monitoring these factors can help in understanding the possible risk at a particular location.

LANDGUARD-NER combines a Machine Learning model with environmental risk calculation to generate an overall landslide risk assessment.

The project also includes an interactive map, risk history, analytics and incident reporting features.

---

## Main Features

### 1. Landslide Risk Assessment

Users can enter information about a location and check its possible landslide risk.

The assessment includes:

- State
- District
- Latitude
- Longitude
- Material involved
- Movement type
- Rainfall
- Soil moisture
- Slope

After submitting the information, the system displays the calculated risk result.

---

### 2. Machine Learning Based Prediction

The project uses a trained Machine Learning model for landslide risk prediction.

The model is loaded by the FastAPI backend and is used during the risk assessment process.

The result includes an ML Risk Score which is used along with environmental factors to calculate the final risk.

---

### 3. Environmental Monitoring

The system provides an environmental monitoring section for the selected assessment location.

It displays:

- Rainfall
- Soil Moisture
- Slope
- Environmental Risk

The environmental information is also used as part of the overall risk assessment.

---

### 4. Risk Levels

The system classifies the calculated risk into different levels:

- Low
- Moderate
- High
- Critical

The risk level is displayed along with the final risk score.

---

### 5. AI Risk Analysis

After an assessment, the dashboard shows a risk analysis section containing:

- ML Risk Score
- Environmental Risk
- Final Risk Score

Progress bars are used to make the risk values easier to understand.

---

### 6. Model Explanation

The result section provides a basic explanation of how the final risk score is formed.

It displays:

- ML Contribution
- Environmental Contribution
- Final Risk Score

This helps the user understand the contribution of different parts of the assessment.

---

### 7. Early Warning

The system includes an early warning section which can display warning information based on the assessed risk.

This allows important risk information to be shown clearly when the calculated risk is higher.

---

### 8. Safety Recommendations

Based on the assessment, the system displays safety recommendations.

These recommendations are shown below the risk result so that the user can easily understand what actions may be considered for the assessed location.

---

## Risk Calculation

The environmental risk calculation uses three main parameters:

### Rainfall

Rainfall is divided into different ranges and contributes to the environmental risk score.

### Soil Moisture

Higher soil moisture contributes more to the risk score.

### Slope

Steeper slopes contribute more to the risk score.

The environmental risk engine uses these parameters to calculate a score and classify it as Low, Moderate, High or Critical.

The Machine Learning prediction and environmental assessment are then used to produce the final risk result.

---

## Risk Assessment Flow

```text
User Input
    |
    v
Location Details
    |
    v
Environmental Parameters
    |
    v
Machine Learning Prediction
    |
    v
Environmental Risk Calculation
    |
    v
Final Risk Score
    |
    v
Risk Level
    |
    v
Recommendations and Warning
