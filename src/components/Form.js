import React from "react";

class Form extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      name: ""
    }
  }

  formSubmit(e) {
    e.preventDefault();
    this.refs.newLocation.value = "";
  }

  handleSearchByName() {
    this.props.onSearchClick(this.refs.newLocation.value);
  }

  render() {
    let placeholder = "Enter a location name"; // or click directly on map";

    return (
      <form onSubmit={this.formSubmit.bind(this)}>
        <div className="input-group pull-left">
          <input ref="newLocation"
                 type="text"
                 className="form-control"
                 placeholder={placeholder}
          />
          <span className="input-group-btn">
              <button type="submit" className="btn btn-default"
                      onClick={this.handleSearchByName.bind(this)}>Search</button>
          </span>
        </div>
        <button className="btn btn-default pull-right"
                onClick={this.props.onClickUseMyLocation}>
          <span className="glyphicon glyphicon-map-marker" aria-hidden="true"></span>
            &nbsp;Use my location
        </button>
      </form>
    )
  }
}

// Form.defaultProps = {};

export default Form;
