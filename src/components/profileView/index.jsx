import gql from 'graphql-tag';
import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import styled from 'styled-components';
import { Route, Switch } from 'react-router-dom';
import Navbar from '../navigation';
import StyledViewRaw from '../reusable/StyledView';
import ProfileViewer from './ProfileViewer';
import ProfileEditor from './ProfileEditor';
import NotFoundView from '../notFoundView';

export const GET_USER = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      fullName
      avatarSrc
      intro
      socialMediaLinks {
        facebookLink
        twitterLink
        instagramLink
        linkedInLink
      }
      me
      followers
      following
    }
  }
`;

const StyledView = styled(StyledViewRaw)`
  align-items: center;
`;

const ProfileView = ({ match }) => {
  const { id } = match.params;
  const vars = { id };
  return (
    <Query query={GET_USER} variables={vars}>
      {({ loading, error, data: { user } }) => {
        if (loading) return <div> loading user data.. </div>;
        if (error) return <div> {error} </div>;
        if (!user) return <div> User not found </div>;

        return (
          <Fragment>
            <Navbar />
            <StyledView>
              <Switch>
                <Route
                  exact
                  path="/userProfile/:id"
                  render={props => <ProfileViewer {...props} user={user} />}
                />
                <Route
                  path="/userProfile/:id/edit"
                  render={props => <ProfileEditor {...props} user={user} />}
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
