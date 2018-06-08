import React, { Component } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../../utils';

class ProtectedRoute extends Component {
  render() {
    const { component: Component, ...props } = this.props;

    return (
      <Route
          {...props}
          render={props => (
            isAuthenticated() ?
              <Component {...props} /> :
              <Redirect to="/login" />
          )}
        />
    );
  }
}

export default ProtectedRoute;
