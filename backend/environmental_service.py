# =====================================================
# ENVIRONMENTAL DATA SERVICE
# =====================================================

import json
import math
from urllib.request import urlopen


def get_elevation(latitude, longitude):
    """
    Get elevation for a location using Open-Meteo.
    """

    url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}"
        f"&longitude={longitude}"
        "&hourly=temperature_2m"
        "&timezone=auto"
    )

    try:
        with urlopen(url, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))

        elevation = data.get("elevation")

        if elevation is None:
            return 0

        return float(elevation)

    except Exception as e:
        print("Elevation API error:", e)
        return 0


def calculate_slope(latitude, longitude):
    """
    Estimate terrain slope using elevation differences
    around the selected location.

    Four nearby points are used:
    north, south, east and west.
    """

    distance = 0.01

    north = get_elevation(latitude + distance, longitude)
    south = get_elevation(latitude - distance, longitude)
    east = get_elevation(latitude, longitude + distance)
    west = get_elevation(latitude, longitude - distance)

    if north == 0 or south == 0 or east == 0 or west == 0:
        return 30

    # Approximate elevation differences
    north_south_difference = abs(north - south)
    east_west_difference = abs(east - west)

    max_difference = max(
        north_south_difference,
        east_west_difference
    )

    # Approximate horizontal distance
    # 0.01 degree is roughly 1.1 km.
    horizontal_distance = 1110

    slope_percent = (
        max_difference / horizontal_distance
    ) * 100

    # Convert slope percentage to degrees
    slope_degrees = math.degrees(
        math.atan(slope_percent / 100)
    )

    slope_degrees = round(slope_degrees, 2)

    # Keep the value within a reasonable range
    slope_degrees = max(0, min(slope_degrees, 90))

    return slope_degrees


def get_environmental_data(latitude, longitude):
    """
    Get environmental data for the given location.

    Rainfall and soil moisture are fetched from
    Open-Meteo using latitude and longitude.

    Slope is estimated using nearby elevation data.
    """

    weather_url = (
        "https://api.open-meteo.com/v1/forecast"
        f"?latitude={latitude}"
        f"&longitude={longitude}"
        "&hourly=precipitation,soil_moisture_0_to_7cm"
        "&past_days=1"
        "&forecast_days=0"
        "&timezone=auto"
    )

    try:
        with urlopen(weather_url, timeout=10) as response:
            data = json.loads(response.read().decode("utf-8"))

        hourly = data["hourly"]

        precipitation = hourly.get(
            "precipitation",
            []
        )

        soil_moisture_data = hourly.get(
            "soil_moisture_0_to_7cm",
            []
        )

        # Total precipitation from the available
        # previous 24-hour period.
        rainfall = round(
            sum(value or 0 for value in precipitation),
            2
        )

        # Latest available soil moisture value.
        soil_values = [
            value
            for value in soil_moisture_data
            if value is not None
        ]

        if soil_values:
            # Convert m³/m³ to approximate percentage.
            soil_moisture = round(
                soil_values[-1] * 100,
                2
            )
        else:
            soil_moisture = 0

        # Calculate terrain slope.
        slope = calculate_slope(
            latitude,
            longitude
        )

        return {
            "rainfall": rainfall,
            "soil_moisture": soil_moisture,
            "slope": slope
        }

    except Exception as e:
        print(
            "Environmental API error:",
            e
        )

        # Fallback values so the application
        # continues working if the API fails.
        return {
            "rainfall": 80,
            "soil_moisture": 65,
            "slope": 30
        }