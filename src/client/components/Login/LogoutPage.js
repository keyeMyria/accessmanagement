import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import * as authActionCreators from "../../actions";

class LogoutPage extends Component {


  componentWillMount() {
    this.props.dispatch(authActionCreators.signOut());
  }

  render() {
    return (
      <Redirect to="/" />
    );
  }

}
export default connect()(LogoutPage);
