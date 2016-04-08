import React from "react";

class Form extends React.Component {

  formSubmit(e) {
    e.preventDefault();
    this.refs.newLocation.value = "";
  }

  handleUseMyLocation() {
    var locationName = this.refs.newLocation.value;

    if (locationName !== "") {
      this.props.onClickUseMyLocation(locationName, null, null);
    }
  }

  render() {
    return (
      <form onSubmit={this.formSubmit.bind(this)}>
        <div className="input-group pull-left">
          <input ref="newLocation"
                 type="text" className="form-control"
                 placeholder="Enter a town/city name"
          />
                    <span className="input-group-btn">
                        <button type="submit" className="btn btn-default"
                                onClick={this.props.onSearchClick}>Search</button>
                    </span>
        </div>
        <button className="btn btn-default pull-right"
                onClick={this.handleUseMyLocation.bind(this)}>
          <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
          Use my location
        </button>
      </form>
    )
  }
}

Form.defaultProps = {};

export default Form;
