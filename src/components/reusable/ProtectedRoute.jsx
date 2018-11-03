import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getAuthToken } from 'Utils';

const ProtectedRoute = ({ component: Component, ...props }) => {
  return (
    <Route
      {...props}
      render={prps =>
        getAuthToken() ? <Component {...prps} /> : <Redirect to="/login" />
      }
    />
  );
};

export default ProtectedRoute;
