import React, { Component } from "react";
import { Route, Redirect } from "react-router-dom";
import { getAuthToken, getLoggedUser } from "Utils";
import { ComponentConstructor } from "react-onclickoutside";
import { UserRoles } from "GqlClient/autoGenTypes";

interface ProtectedRouteProps {
  component: ComponentConstructor<any>;
  userRole?: UserRoles;
  path: string;
}

const ProtectedRoute = ({
  component: RouteComponent,
  ...props
}: ProtectedRouteProps) => {
  return (
    <Route
      {...props}
      render={prps => {
        const loggedUser = getLoggedUser();

        if (!loggedUser) {
          return <Redirect to="/" />;
        }

        if (props.userRole && loggedUser.role !== props.userRole) {
          return <Redirect to="/" />;
        }

        return <RouteComponent {...prps} />;
      }}
    />
  );
};

export default ProtectedRoute;
