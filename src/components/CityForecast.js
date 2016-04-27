import React from "react";

class CityForecast extends React.Component {

  /**
   * Return temperature based on selected scale
   * Kelvin scale by default.
   *
   * @param kelvinDeg
   * @param scaleType
   * @returns number
   */
  prepareTemperature(kelvinDeg = 0, scaleType = null) {

    if (scaleType === 1) { // "celsius"
      return Math.round(kelvinDeg - 273.15);
    }

    if (scaleType === 2) { // "fahrenheit"
      return Math.round(kelvinDeg * (9 / 5) - 459.67);
    }

    return Math.round(kelvinDeg);
  }

  render() {
    var { temperatureScales, scaleType, temp, tempMin, tempMax,
          location, lat, lon, icon, weather, humidity, pressure,
          sunrise, sunset, timestamp } = this.props;

    temp = this.prepareTemperature(temp, scaleType),
    tempMin = this.prepareTemperature(tempMin, scaleType),
    tempMax = this.prepareTemperature(tempMax, scaleType);

    let scale = temperatureScales.find(item => item.id === scaleType),
      scaleSymbol = "";

    if ( (scale !== undefined) && (scale.symbol !== undefined) ) {
      scaleSymbol = scale.symbol;
    }

    return (
      <div className="b-weather panel-heading">
        <div className="b-weather__city text-muted"><strong>{location}</strong>
          &nbsp;[{lat}, {lon}]
        </div>

        <div className="b-weather__icon">
          <img src={icon}/>
        </div>

        <div>
          <div className="b-weather__atmosphere-status text-muted">{weather}</div>
          <div className="b-weather__atmosphere-status text-muted">Humidity: {humidity} %</div>
          <div className="b-weather__atmosphere-status text-muted">Pressure: {pressure} hpa</div>
          <div className="b-weather__atmosphere-status text-muted">Temp: {temp}&nbsp;{scaleSymbol}
            &nbsp;( min: {tempMin}&nbsp;{scaleSymbol}, max: {tempMax}&nbsp;{scaleSymbol} )
          </div>
        </div>

        <div>
          <div className="b-weather__atmosphere-status text-muted">Sunrise: {sunrise}</div>
          <div className="b-weather__atmosphere-status text-muted">Sunset: {sunset}</div>
        </div>
        <div className="b-weather__timestamp text-muted">Updated as of {timestamp}</div>
      </div>
    )
  }
}

CityForecast.defaultProps = {
  temperatureScales: [],
  scaleType: 0,
  temp: 0,
  tempMin: 0,
  tempMax: 0,
  location: "",
  lat: "",
  lon: "",
  icon: "",
  weather: "",
  humidity: "",
  pressure: "",
  sunrise: "",
  sunset: "",
  timestamp: ""
};

export default CityForecast;
