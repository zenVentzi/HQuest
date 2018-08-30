import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../../utils';

const ProtectedRoute = ({ component: Component, ...props }) => {
  return (
    <Route
      {...props}
      render={prps =>
        isAuthenticated() ? <Component {...prps} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
