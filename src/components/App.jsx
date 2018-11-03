import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import { ThemeProvider } from 'styled-components';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import ApolloClient from './ApolloClient';
import ProtectedRoute from './reusable/ProtectedRoute';
import Navbar from './navigation';
import AdminView from './adminView';
import SearchView from './searchView';
import ProfileView from './profileView';
import HelpView from './helpView';
import LandingView from './landingView';
import NotFoundView from './notFoundView';
import { theme, GlobalStyle } from './appTheme';

const App = () => {
  return (
    <ApolloProvider client={ApolloClient}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <div>
            <GlobalStyle />
            <ToastContainer
              hideProgressBar
              position="top-center"
              autoClose={1500}
              transition={Zoom}
            />
            <Navbar />
            <Switch>
              <ProtectedRoute path="/userProfile/:id" component={ProfileView} />
              <ProtectedRoute path="/admin" component={AdminView} />
              <ProtectedRoute path="/search" component={SearchView} />
              <Route path="/help" component={HelpView} />
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
