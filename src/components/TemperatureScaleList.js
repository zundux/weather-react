import React from "react";

class TemperatureScaleFilter extends React.Component {
  constructor(props) {
    super(props);
    this.temperatureScales = {
      kelvin: {name: "Kelvin", symbol: "K"},
      celsius: {name: "Celsius", symbol: "C"},
      fahrenheit: {name: "Fahrenheit", symbol: "F"}
    };
  }

  handleClick(event) {
    console.log(arguments);
    this.props.onChange(event);
  }

  render() {

    let scales = this.temperatureScales.map(this.renderItem.bind(this));

    return (
      <div className="btn-toolbar" role="toolbar"
           aria-label="Temperature scale">
        {scales}
      </div>
    )
  }

  renderItem(scale, index) {
    let classes = "btn btn-default",
      handleClick = this.handleClick.bind(this),
      areaLabel = name + "scale";

    if (index === this.props.scaleType) {
      classes = +" active";
    }

    return (
      <button onClick={handleClick}
              type="button"
              className={classes}
              aria-label={areaLabel}>
        {scale.symbol}
      </button>
    );
  }
}

TemperatureScaleFilter.defaultProps = {
  temperatureScale: "celsius"
};

export default TemperatureScaleFilter;
