require("normalize.css/normalize.css");
require("styles/App.css");

import React from "react";
import CityForecast from "./CityForecast";

/* global $, google */

class WeatherApp extends React.Component {

   constructor(props) {
    super(props);

    this.state = {
      lat: 0,
      lon: 0,
      location: "",
      sunrise: "",
      sunset: "",
      timestamp: "",
      weather: "",
      humidity: "",
      pressure: "",
      temp: "",
      temp_max: "",
      temp_min: "",
      icon: "",

      showResults: true
    };

    this.map = {};
    this.marker = {};
    this.temperatureScales = {
      kelvin: {name: "Kelvin", symbol: "K"},
      celsius: {name: "Celsius", symbol: "C"},
      fahrenheit: {name: "Fahrenheit", symbol: "F"}
    };

    this.config = {
      initialLat: 56.01,
      initialLon: 92.79,
      mapZoomLevel: 11,
      openWeatherAPIKey: "8500593fcdaa73da9938b3bd5a9978bf"
    };

  }

  componentDidMount() {
    this.initMap();
    this.refreshMap(null, this.state.lat, this.state.lon);
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

  refreshMap(locationName, lat, lon) {
    this.fetchForecastData(locationName, lat, lon)
      .then(this.fetchForecastDataSuccess.bind(this));
  }

  prepareTimestamp(seconds) {
    if (seconds === undefined) {
      return "";
    }

    return new Date(seconds * 1000)
  }

  geolocationSearchError(error) {
    if (error.message == "User denied Geolocation") {
      alert("Please enable location services");
    }
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
      temp: this.prepareTemperature(data.main.temp, this.state.temperatureScale),
      temp_max: this.prepareTemperature(data.main.temp_max, this.state.temperatureScale),
      temp_min: this.prepareTemperature(data.main.temp_min, this.state.temperatureScale),
      icon: "http://openweathermap.org/img/w/" + data.weather[0].icon + ".png",

      showResults: true
    };

    this.setState(mappedData, this.updateMap);
  }

  /**
   * Return temperature based on selected scale
   *
   * @param kelvinDeg
   * @param scaleType
   * @returns number
   */
  prepareTemperature(kelvinDeg, scaleType) {
    if (kelvinDeg === undefined) {
      return 0;
    }

    if (scaleType === this.temperatureScales.celsius) {
      return kelvinDeg - 273.15;
    }

    if (scaleType === this.temperatureScales.celsius) {
      return kelvinDeg * (9 / 5) - 459.67;
    }

    return kelvinDeg;
  }

  locationSearchHandler() {
    var locationName = this.refs.newLocation.value;

    if (locationName !== "") {
      this.refreshMap(locationName, null, null);
    }
  }

  geolocationSearchHandler() {
    navigator.geolocation.getCurrentPosition(
      this.geolocationSearchSuccess.bind(this), this.geolocationSearchError.bind(this));
  }

  geolocationSearchSuccess(position) {
    var lat = position.coords.latitude,
      lon = position.coords.longitude;

    this.refreshMap(null, lat, lon);
  }

  formSubmit(e) {
    e.preventDefault();
    this.refs.newLocation.value = "";
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

    this.refreshMap(null, lat, lng);
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

  render() {
    return (
      <div className="b-app__container">
        <div className="b-sidebar" ref="sidebarPanel">
          <div className="b-sidebar__panel panel panel-default">
            <div className="b-sidebar__panel panel-body">

              <form onSubmit={this.formSubmit.bind(this)}>
                <div className="input-group pull-left">
                  <input ref="newLocation"
                         type="text" className="form-control"
                         placeholder="Enter a town/city name"
                  />
                  <span className="input-group-btn">
                      <button type="submit" className="btn btn-default"
                              onClick={this.locationSearchHandler.bind(this)}>Search</button>
                  </span>
                </div>
                <button className="btn btn-default pull-right"
                        onClick={this.geolocationSearchHandler.bind(this)}>
                  <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
                  Use my location
                </button>
              </form>

            </div>
            <div className="panel-heading text-center">
               <span className="text-muted">
                 Enter a place name below, drag the marker
                 click directly on the map
               </span>
            </div>
            { this.state.showResults ?
              <CityForecast {...this.state}/>
             : null }
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
