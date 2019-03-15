import React, { Fragment } from "react";
import { Query } from "react-apollo";
import styled from "styled-components";
import shortid from "shortid";
import { Route, Switch, RouteComponentProps } from "react-router-dom";
import { GET_USER } from "GqlClient/user/queries";
import { UserQuery, UserVariables } from "GqlClient/autoGenTypes";
import StyledViewRaw from "../reusable/StyledView";
import ProfileViewer from "./ProfileViewer";
import ProfileEditor from "./ProfileEditor";
import QuestionPin from "./QuestionPin";
import NotFoundView from "../notFoundView";

const StyledView = styled(StyledViewRaw)`
  align-items: center;
`;

interface ProfileViewProps extends RouteComponentProps<{ id: string }> {}

const ProfileView = ({ match }: ProfileViewProps) => {
  const { id } = match.params;
  const vars: UserVariables = { id };

  // return null;
  return (
    <StyledView>
      <Query<UserQuery, UserVariables>
        query={GET_USER}
        variables={vars}
        fetchPolicy="network-only" // this could be changed to cache-and-network, the default, if not using HOT RELOAD
        errorPolicy="all"
      >
        {({ loading, error, data }) => {
          if (loading) return <div> Loading user profile.. </div>;
          if (error) {
            return (
              <pre>
                {error.graphQLErrors.map(({ message }, i) => (
                  <span key={`${shortid.generate()}`}>{message}</span>
                ))}
              </pre>
            );
          }

          const { user } = data!;

          if (!user) {
            return <div>User not found</div>;
          }

          // console.log(user);

          return (
            <Fragment>
              <Switch>
                <Route
                  path="/userProfile/:id/:questionId/:commentId"
                  render={props => (
                    <QuestionPin {...props} editable={!!user.me} />
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
            </Fragment>
          );
        }}
      </Query>
    </StyledView>
  );
};

export default ProfileView;
