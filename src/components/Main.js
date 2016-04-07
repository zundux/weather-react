require("normalize.css/normalize.css");
require("styles/App.css");

import React from "react";
import CityForecast from "./CityForecast";
import Form from "./Form";
import TemperatureScaleFilter from "./TemperatureScaleList";

/* global $, google */

class WeatherApp extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      lat: 0,
      lon: 0,
      location: "",
      timestamp: "",

      sunrise: "",
      sunset: "",
      weather: "",
      humidity: "",
      pressure: "",
      temp: "",
      tempMax: "",
      tempMin: "",
      icon: "",

      showResults: true,
      scaleType: 1 // celsius
    };

    this.map = {};
    this.marker = {};
    this.config = {
      initialLat: 56.01,
      initialLon: 92.79,
      mapZoomLevel: 11,
      openWeatherAPIKey: "8500593fcdaa73da9938b3bd5a9978bf"
    };

    this.temperatureScales = [
      {id: 0, name: "kelvin", symbol: "K"},
      {id: 1, name: "celsius", symbol: "℃"},
      {id: 2, name: "fahrenheit", symbol: "℉"}
    ];
  }

  componentDidMount() {
    this.initMap();
    this.getForecastData(null, this.state.lat, this.state.lon);
  }

  fetchForecastData(locationName, lat, lon) {

    var data;

    if (locationName !== null) {
      data = $.get("http://api.openweathermap.org/data/2.5/weather?q=" + locationName + "&APPID=" + this.config.openWeatherAPIKey);
      return data;
    }

    data = $.get("http://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + lon + "&APPID=" + this.config.openWeatherAPIKey);
    return data;
  }

  getForecastData(locationName, lat, lon) {
    this.fetchForecastData(locationName, lat, lon)
      .then(this.fetchForecastDataSuccess.bind(this));
  }

  fetchForecastDataSuccess(data) {
    var mappedData = {
      lat: data.coord.lat,
      lon: data.coord.lon,
      location: data.name,
      sunrise: this.prepareTimestamp(data.sys.sunrise).toLocaleTimeString(),
      sunset: this.prepareTimestamp(data.sys.sunset).toLocaleTimeString(),
      timestamp: this.prepareTimestamp(data.dt).toLocaleString(),
      weather: data.weather[0].description,
      humidity: data.main.humidity,
      pressure: data.main.pressure,
      temp: data.main.temp,
      tempMax: data.main.temp_max,
      tempMin: data.main.temp_min,
      icon: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",

      showResults: true
    };

    this.setState(mappedData, this.updateMap);
  }

  prepareTimestamp(seconds) {
    if (seconds === undefined) {
      return "";
    }

    return new Date(seconds * 1000)
  }

  handleUseMyLocation(locationName) {
    this.getForecastData(locationName, null, null);
  }

  handleCitySearch() {
    navigator.geolocation.getCurrentPosition(
      this.geolocationSearchSuccess.bind(this),
      this.geolocationSearchError.bind(this)
    );
  }

  geolocationSearchSuccess(position) {
    var lat = position.coords.latitude,
      lon = position.coords.longitude;

    this.getForecastData(null, lat, lon);
  }

  geolocationSearchError(error) {
    if (error.message == "User denied Geolocation") {
      alert("Please enable location services");
    }
  }

  initMap() {
    this.map = new google.maps.Map(this.refs.map, {
      zoom: this.config.mapZoomLevel,
      disableDefaultUI: true,
      zoomControl: true
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true
    });

    this.marker.setAnimation(google.maps.Animation.DROP);

    google.maps.event.addListener(this.map, "click", this.mapUpdateHandler);
    // google.maps.event.addListener(this.marker, "dragend", this.mapUpdateHandler);
    this.map.addListener("zoom_changed", this.mapZoomChangedHandler.bind(this));
  }

  mapUpdateHandler(event) {
    var latLng = event.latLng,
      lat = latLng.lat(),
      lng = latLng.lng();

    this.getForecastData(null, lat, lng);
  }

  mapZoomChangedHandler() {
    this.mapZoomLevel = this.map.getZoom();
  }

  updateMap() {
    var coordinates = new google.maps.LatLng(this.state.lat, this.state.lon);

    window.setTimeout(function () {
      this.marker.setPosition(coordinates);

      var sidebarWidth = this.refs.sidebarPanel.offsetWidth,
        windowWidth = window.innerWidth
          || document.documentElement.clientWidth
          || document.body.clientWidth,
        rightOffset = Math.abs(sidebarWidth - windowWidth),
        mapCenter = this.getOffsetCenter(coordinates, -rightOffset, 0);

      console.log(rightOffset, windowWidth, sidebarWidth);

      if (mapCenter) {
        this.map.setCenter(mapCenter);
      }

    }.bind(this), 300);
  }

  /**
   * Return new center for map with applied offsets.
   * Offsets can be negative.
   *
   * @param latlng - is the apparent centre-point
   * @param offsetx - is the distance you want that point to move to the right, in pixels
   * @param offsety - is the distance you want that point to move upwards, in pixels
   * @returns {*}
   */
  getOffsetCenter(latlng, offsetx, offsety) {

    if (latlng === undefined) {
      return false;
    }

    var scale = Math.pow(4, this.map.getZoom()),
      worldCoordinateCenter = this.map.getProjection().fromLatLngToPoint(latlng),
      pixelOffset = new google.maps.Point((offsetx / scale) || 0, (offsety / scale) || 0),
      worldCoordinateNewCenter = new google.maps.Point(
        worldCoordinateCenter.x - pixelOffset.x,
        worldCoordinateCenter.y + pixelOffset.y
      );

    return this.map.getProjection().fromPointToLatLng(worldCoordinateNewCenter);
  }

  handleChangeTemperatureScale(scaleType) {
    this.setState({
      scaleType: scaleType
    });
  }

  render() {
    return (
      <div className="b-app__container">
        <div className="b-sidebar" ref="sidebarPanel">
          <div className="b-sidebar__panel panel panel-default">
            <div className="b-sidebar__panel panel-body">
              <Form onSearchClick={this.handleCitySearch.bind(this)}
                    onClickUseMyLocation={this.handleUseMyLocation.bind(this)}/>
            </div>
            <div className="panel-heading text-center">
               <span className="text-muted">
                 Enter a place name above,&nbsp;
                 {/* drag the marker */ }
                 click directly on the map
               </span>
            </div>
            <div className="panel-heading">
              <span className="text-muted">
               Select temperature scale
              </span>
              <TemperatureScaleFilter
                scales={this.temperatureScales}
                scaleType={this.state.scaleType}
                onChange={this.handleChangeTemperatureScale.bind(this)}/>
            </div>
            <div className="b-city__wrapper">

              <div className="b-city__list">
                { this.state.showResults ?
                  <CityForecast {...this.state} temperatureScales={this.temperatureScales}/>
                  : null }
              </div>
            </div>
            <ul className="list-group">
              <li className="list-group-item">Moscow</li>
              <li className="list-group-item">Istanbul</li>
              <li className="list-group-item">Madrid</li>
              <li className="list-group-item">Venice</li>
              <li className="list-group-item">Saint Petersburg</li>
            </ul>
          </div>
        </div>
        <div ref="map" className="b-map"></div>
      </div>
    );
  }
}

WeatherApp.defaultProps = {};
WeatherApp.propTypes = {};

export default WeatherApp;
