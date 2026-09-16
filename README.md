# LANDGUARD-NER

## Landslide Risk Monitoring System

LANDGUARD-NER is a web-based system for checking landslide risk in the North Eastern Region of India.

The project uses Machine Learning along with environmental conditions such as rainfall, soil moisture and slope to calculate a landslide risk score.

## What this project does

- Checks landslide risk for a selected location
- Uses a Machine Learning model for prediction
- Takes rainfall, soil moisture and slope into account
- Shows ML risk score and environmental risk
- Gives the final risk level
- Shows safety recommendations
- Stores previous risk assessments
- Shows risk analytics
- Allows users to report landslide incidents
- Displays historical landslide locations on a map

## Input Details

The user can enter:

- State
- District
- Latitude
- Longitude
- Material involved
- Movement type
- Rainfall
- Soil moisture
- Slope

## Technologies Used

**Frontend**
- HTML
- CSS
- JavaScript
- Leaflet.js

**Backend**
- Python
- FastAPI
- Uvicorn

**Machine Learning**
- Scikit-learn
- Pandas
- Joblib

## Project Structure

```text
LANDGUARD-NER/
│
├── backend/
├── data/
├── frontend/
├── ml/
├── models/
├── index.html
└── README.md
