function formatTemperature(value, unitSystem) {
  if (unitSystem === "imperial") {
    const fahrenheit = (value * 9) / 5 + 32;
    return `${fahrenheit.toFixed(0)}°F`;
  }
  return `${value.toFixed(0)}°C`;
}

function formatWindSpeed(value, unitSystem) {
  if (unitSystem === "imperial") {
    const mph = value * 2.237;
    return `${mph.toFixed(0)} wind_speed_unit_mph`;
  }
  return `${value.toFixed(0)} wind_speed_unit_mps`;
}

function formatPressure(value, unitSystem) {
  if (unitSystem === "imperial") {
    const inHg = value * 0.02953;
    return `${inHg.toFixed(1)} pressure_unit_inhg`;
  }
  return `${value.toFixed(0)} pressure_unit_mbar`;
}

function formatPrecipitation(value, unitSystem) {
    if (unitSystem === "imperial") {
      const inches = value / 25.4;
      return `${inches.toFixed(2)} precipitation_unit_in`;
    }
    return `${value} precipitation_unit_mm`;
  }
  

function formatVisibility(value, unitSystem) {
  if (unitSystem === "imperial") {
    const miles = value * 0.621371;
    return `${miles.toFixed(1)} visibility_unit_mi`;
  }
  return `${value} visibility_unit_km`;
}

export { formatTemperature, formatWindSpeed, formatPressure, formatPrecipitation, formatVisibility };