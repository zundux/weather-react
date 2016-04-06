import React from "react";

class CityForecast extends React.Component {
  render() {
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
          <div className="b-weather__atmosphere-status text-muted">Temp: {this.props.temp} (
            min: {this.props.temp_min}, max: {this.props.temp_max})
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

CityForecast.defaultProps = {};

export default CityForecast;
