import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { getAuthToken } from "Utils";
import { ComponentConstructor } from "react-onclickoutside";

interface ProtectedRouteProps {
  component: ComponentConstructor<any>;
}

const ProtectedRoute = ({
  component: RouteComponent,
  ...props
}: ProtectedRouteProps) => {
  return (
    <Route
      {...props}
      render={prps =>
        getAuthToken() ? <RouteComponent {...prps} /> : <Redirect to="/" />
      }
    />
  );
};

export default ProtectedRoute;
