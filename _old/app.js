'use strict';
/* global React, google */

var WeatherApp = React.createClass({

  map: {},
  marker: {},
  temperatureScales: {
    kelvin: {name: 'Kelvin', symbol: 'K'},
    celsius: {name: 'Celsius', symbol: 'C'},
    fahrenheit: {name: 'Fahrenheit', symbol: 'F'}
  },

  config: {
    initialLat: 56.01,
    initialLon: 92.79,
    mapZoomLevel: 11,
    openWeatherAPIKey: '8500593fcdaa73da9938b3bd5a9978bf'
  },

  getInitialState: function () {
    return {
      lat: this.config.initialLat,
      lon: this.config.initialLon,
      temperatureScale: 0,

      showResults: false
    };
  },

  /**
   * Request data from the API
   */
  getData: function (locationName, lat, lon) {

    var data;

    if (locationName !== null) {
      data = $.get('http://api.openweathermap.org/data/2.5/weather?q=' + locationName + '&APPID=' + this.config.openWeatherAPIKey);
      return data;
    }

    data = $.get('http://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&APPID=' + this.config.openWeatherAPIKey);
    return data;
  },

  updateState: function (locationName, lat, lon) {
    this.getData(locationName, lat, lon)
      .then(this.getDataSuccess);
  },

  getDataSuccess: function (data) {
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
      icon: 'http://openweathermap.org/img/w/' + data.weather[0].icon + '.png',

      showResults: true
    };

    this.setState(mappedData, this.updateMap);
  },

  /**
   * Return temperature based on selected scale
   *
   * @param kelvinDeg
   * @param scaleType
   * @returns number
   */
  prepareTemperature: function (kelvinDeg, scaleType) {
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
  },

  prepareTimestamp: function (seconds) {
    if (seconds === undefined) {
      return '';
    }

    return new Date(seconds * 1000)
  },

  locationSearchHandler: function () {
    var locationName = this.refs.newLocation.getDOMNode().value;

    if (locationName !== '') {
      this.updateState(locationName, null, null);
    }
  },

  geolocationSearchHandler: function () {
    navigator.geolocation.getCurrentPosition(
      this.geolocationSearchSuccess, this.geolocationSearchError);
  },

  geolocationSearchSuccess: function (position) {
    var lat = position.coords.latitude,
      lon = position.coords.longitude;

    this.updateState(null, lat, lon);
  },

  geolocationSearchError: function (error) {
    if (error.message == 'User denied Geolocation') {
      alert('Please enable location services');
    }
  },

  formSubmit: function (e) {
    e.preventDefault();
    this.refs.newLocation.getDOMNode().value = '';
  },

  initMap: function () {
    this.map = new google.maps.Map(this.refs.map.getDOMNode(), {
      zoom: this.config.mapZoomLevel,
      disableDefaultUI: true,
      zoomControl: true
    });

    this.marker = new google.maps.Marker({
      map: this.map,
      draggable: true
    });

    this.marker.setAnimation(google.maps.Animation.DROP);

    google.maps.event.addListener(this.map, 'click', this.mapUpdateHandler);
    // google.maps.event.addListener(this.marker, 'dragend', this.mapUpdateHandler);
    this.map.addListener('zoom_changed', this.mapZoomChangedHandler);
  },

  mapUpdateHandler: function (event) {
    var latLng = event.latLng,
      lat = latLng.lat(),
      lng = latLng.lng();

    this.updateState(null, lat, lng)
  },

  mapZoomChangedHandler: function () {
    this.mapZoomLevel = this.map.getZoom();
  },

  updateMap: function () {
    var coordinates = new google.maps.LatLng(this.state.lat, this.state.lon);

    window.setTimeout(function () {
      this.marker.setPosition(coordinates);

      var sidebarWidth = this.refs.sidebarPanel.getDOMNode().offsetWidth,
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
  },

  /**
   * Return new center for map with applied offsets.
   * Offsets can be negative.
   *
   * @param latlng - is the apparent centre-point
   * @param offsetx - is the distance you want that point to move to the right, in pixels
   * @param offsety - is the distance you want that point to move upwards, in pixels
   * @returns {*}
   */
  getOffsetCenter: function (latlng, offsetx, offsety) {

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
  },

  showResults: function () {
    return this.state.showResults;
  },

  componentDidMount: function () {
    this.initMap();
    this.updateState(null, this.state.lat, this.state.lon);
  },

  render: function () {
    return (
      <div className='b-app__container'>
        <div className='b-sidebar' ref='sidebarPanel'>
          <div className='b-sidebar__panel panel panel-default-'>
            <div className='b-sidebar__panel panel-body'>

              <form onSubmit={this.formSubmit}>
                <div className='input-group pull-left'>
                  <input ref='newLocation'
                         type='text' className='form-control'
                         placeholder='Enter a town/city name'
                  />
                  <span className='input-group-btn'>
                      <button type='submit' className='btn btn-default'
                              onClick={this.locationSearchHandler}>Search</button>
                  </span>
                </div>
                <button className='btn btn-default pull-right'
                        onClick={this.geolocationSearchHandler}>
                  <span className='glyphicon glyphicon-map-marker' aria-hidden='true'></span>
                  Use my location
                </button>
              </form>

            </div>
            <div className='panel-heading text-center'>
               <span className='text-muted'>
                 Enter a place name below, drag the marker
                 click directly on the map
               </span>
             </div>
            { this.showResults() ? <WeatherDetails {...this.state}/> : null }
          </div>
        </div>
        <div ref='map' className='b-map'></div>
      </div>
    );
  }

});

var WeatherDetails = React.createClass({
  render: function () {
    return (
      <div className='b-weather panel-heading'>
        <div className='b-weather__city text-muted'><strong>{this.props.location}</strong>
          &nbsp;[{this.props.lat}, {this.props.lon}]
        </div>
        <div className='b-weather__icon'>
          <img src={this.props.icon}/>
        </div>
        <div>
          <div className='b-weather__atmosphere-status text-muted'>{this.props.weather}</div>
          <div className='b-weather__atmosphere-status text-muted'>Humidity: {this.props.humidity} %</div>
          <div className='b-weather__atmosphere-status text-muted'>Pressure: {this.props.pressure} hpa</div>
          <div className='b-weather__atmosphere-status text-muted'>Temp: {this.props.temp} (
            min: {this.props.temp_min}, max: {this.props.temp_max})
          </div>
        </div>

        <div>
          <div className='b-weather__atmosphere-status text-muted'>Sunrise: {this.props.sunrise}</div>
          <div className='b-weather__atmosphere-status text-muted'>Sunset: {this.props.sunset}</div>
        </div>
        <div className='b-weather__timestamp text-muted'>Updated as of {this.props.timestamp}</div>
      </div>
    )
  }
});

React.render(<WeatherApp />, document.getElementById('app'));
