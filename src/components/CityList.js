import React from "react";

class CityList extends React.Component {
  render() {
    return (
      <form onSubmit={this.formSubmit}></form>
    )
  }
}

CityList.defaultProps = {};

export default CityList;
