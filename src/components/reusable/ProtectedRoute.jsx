import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { isAuthenticated } from '../../utils';

const ProtectedRoute = ({ component: Component, ...props }) => {
  const holder = 5;

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
