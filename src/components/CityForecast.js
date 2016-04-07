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

    if (scaleType === "celsius") {
      return Math.round(kelvinDeg - 273.15);
    }

    if (scaleType === "fahrenheit") {
      return Math.round(kelvinDeg * (9 / 5) - 459.67);
    }

    return Math.round(kelvinDeg);
  }

  render() {
    let temp = this.prepareTemperature(this.props.temp, this.props.scaleType),
      tempMin = this.prepareTemperature(this.props.tempMin, this.props.scaleType),
      tempMax = this.prepareTemperature(this.props.tempMax, this.props.scaleType),
      scale = Array.prototype.find(
        item => item.id === this.props.scaleType, this.props.temperatureScales),
      scaleSymbol = (scale !== undefined) && (scale.symbol !== undefined) ? scale.symbol : "";

    console.log(scale);


    return (
      <div className="b-weather panel-heading">
        <div className="b-weather__city text-muted"><strong>{this.props.location}</strong>
          &nbsp;[{this.props.lat}, {this.props.lon}]
        </div>
        <div className="b-weather__icon">
          <img src={this.props.icon}/>
        </div>
        <div>
          <div className="b-weather__atmosphere-status text-muted">{this.props.weather}</div>
          <div className="b-weather__atmosphere-status text-muted">Humidity: {this.props.humidity} %</div>
          <div className="b-weather__atmosphere-status text-muted">Pressure: {this.props.pressure} hpa</div>
          <div className="b-weather__atmosphere-status text-muted">Temp: {temp}{scaleSymbol} (
            min: {tempMin}, max: {tempMax})
          </div>
        </div>

        <div>
          <div className="b-weather__atmosphere-status text-muted">Sunrise: {this.props.sunrise}</div>
          <div className="b-weather__atmosphere-status text-muted">Sunset: {this.props.sunset}</div>
        </div>
        <div className="b-weather__timestamp text-muted">Updated as of {this.props.timestamp}</div>
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
