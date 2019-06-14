import React from "react";
import { Query } from "react-apollo";
import User from "./UserRow";
import { GET_FOLLOWERS } from "GqlClient/user/queries";
import WhitePanel from "Reusable/WhitePanel";
import {
  FollowersQuery,
  FollowersQueryVariables
} from "GqlClient/autoGenTypes";

interface FollowersProps {
  userId: string;
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Followers = ({ userId, onClose }: FollowersProps) => {
  return (
    <WhitePanel onClose={onClose}>
      <Query<FollowersQuery, FollowersQueryVariables>
        query={GET_FOLLOWERS}
        variables={{ userId }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <div style={{ color: "black" }}> Loading following..</div>;
          } else if (error) {
            return <div style={{ color: "black" }}> {error.message} </div>;
          }

          const { followers } = data!;

          if (!followers || !followers.length) {
            return <div>User has no followers</div>;
          }

          return followers.map(f => (
            <User inversedColors size={2} key={f.id} user={f} />
          ));
        }}
      </Query>
    </WhitePanel>
  );
};

export default Followers;
