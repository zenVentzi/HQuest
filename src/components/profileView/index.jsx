import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import shortid from 'shortid';
import { Route, Switch } from 'react-router-dom';
import { GET_USER } from 'Queries';
import Navbar from '../navigation';
import StyledViewRaw from '../reusable/StyledView';
import ProfileViewer from './ProfileViewer';
import ProfileEditor from './ProfileEditor';
import QuestionPin from './QuestionPin';
import NotFoundView from '../notFoundView';

const StyledView = styled(StyledViewRaw)`
  align-items: center;
`;

const ProfileView = ({ match }) => {
  const { id } = match.params;
  const vars = { id };
  return (
    <Query query={GET_USER} variables={vars} errorPolicy="all">
      {({ loading, error, data: { user } }) => {
        if (loading) return <div> loading user data.. </div>;
        if (error) {
          return (
            <pre>
              {error.graphQLErrors.map(({ message }, i) => (
                <span key={`${shortid.generate()}`}>{message}</span>
              ))}
            </pre>
          );
        }

        return (
          <Fragment>
            <Navbar />
            <StyledView>
              <Switch>
                <Route
                  path="/userProfile/:id/:questionId/:commentId"
                  render={props => (
                    <QuestionPin {...props} editable={user.me} />
                  )}
                />
                <Route
                  path="/userProfile/:id/edit"
                  render={props => <ProfileEditor {...props} user={user} />}
                />
                <Route
                  path="/userProfile/:id"
                  render={props => <ProfileViewer {...props} user={user} />}
                />
                <Route component={NotFoundView} />
              </Switch>
            </StyledView>
          </Fragment>
        );
      }}
    </Query>
  );
};

export default ProfileView;
