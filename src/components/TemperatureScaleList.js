import React from "react";

class TemperatureScaleFilter extends React.Component {

  constructor(props) {
    super(props);
  }

  handleClick(event) {
    this.props.onChange(event);
  }

  renderItem(scale, index) {

    let classes = "btn btn-default",
      areaLabel = name + "scale";

    if (scale.id === this.props.scaleType) {
      classes += " active";
    }

    return (
      <button key={index} onClick={this.handleClick.bind(this, scale.id)}
              type="button"
              className={classes}
              aria-label={areaLabel}>
        {scale.symbol}
      </button>
    );
  }

  render() {

    let scales = "";

    if (this.props.scales.length) {
      scales = this.props.scales.map(this.renderItem.bind(this));
    }

    return (
      <div className="btn-toolbar" role="toolbar"
           aria-label="Temperature scale">
        {scales}
      </div>
    )
  }
}

TemperatureScaleFilter.defaultProps = {
  scaleType: 1, //celsius
  scales: {}
};

export default TemperatureScaleFilter;
