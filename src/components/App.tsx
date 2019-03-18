import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { ApolloProvider, ApolloConsumer } from "react-apollo";
import { ThemeProvider } from "styled-components";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ApolloClient from "../graphql/ApolloClient";
import ProtectedRoute from "./reusable/ProtectedRoute";
import Navbar from "./navigation";
import AdminView from "./adminView";
import SearchView from "./searchView";
import ProfileView from "./profileView";
import HelpView from "./helpView";
import NewsfeedView from "./newsfeedView";
import LandingView from "./landingView";
import NotFoundView from "./notFoundView";
import { GlobalStyle } from "./appTheme";

const App = () => {
  // console.log(`testt`);
  // return <div>test</div>;
  return (
    <ApolloProvider client={ApolloClient}>
      <ThemeProvider theme={{}}>
        <BrowserRouter>
          <div>
            <GlobalStyle />
            <ToastContainer
              hideProgressBar
              position={toast.POSITION.TOP_RIGHT}
              autoClose={1500}
              transition={Zoom}
            />
            <Navbar />
            <Switch>
              <ProtectedRoute path="/userProfile/:id" component={ProfileView} />
              <ProtectedRoute path="/admin" component={AdminView} />
              <ProtectedRoute path="/search" component={SearchView} />
              <ProtectedRoute path="/help" component={HelpView} />
              <ProtectedRoute path="/newsfeed" component={NewsfeedView} />
              <Route path="/" exact component={LandingView} />
              <Route component={NotFoundView} />
            </Switch>
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </ApolloProvider>
  );
};

export default App;
