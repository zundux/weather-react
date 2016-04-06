import React from "react";

class Form extends React.Component {
  render() {
    return (
      <form onSubmit={this.formSubmit}></form>
    )
  }
}

Form.defaultProps = {};

export default Form;
