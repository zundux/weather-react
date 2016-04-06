import React from "react";

class Map extends React.Component {
  render() {
    return (
      <div ref="map" className="b-map"></div>
    )
  }
}

Map.defaultProps = {};

export default Map;
