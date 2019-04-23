import React from "react";
import { Query } from "react-apollo";
import User from "Reusable/UserRow";
import { GET_FOLLOWING } from "GqlClient/user/queries";
import WhitePanel from "Reusable/WhitePanel";
import {
  FollowingQuery,
  FollowingQueryVariables
} from "GqlClient/autoGenTypes";

interface FollowingProps {
  userId: string;
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Following = ({ userId, onClose }: FollowingProps) => {
  return (
    <WhitePanel onClose={onClose}>
      <Query<FollowingQuery, FollowingQueryVariables>
        query={GET_FOLLOWING}
        variables={{ userId }}
      >
        {({ loading, error, data }) => {
          if (loading) {
            return <div style={{ color: "black" }}> Loading following..</div>;
          }
          if (error) {
            return <div style={{ color: "black" }}> {error.message} </div>;
          }

          const { following } = data!;

          if (!following || !following.length) {
            return <div>User doesn't follow anyone</div>;
          }

          return following.map(f => (
            <User inversedColors size={2} key={f.id} user={f} />
          ));
        }}
      </Query>
    </WhitePanel>
  );
};

export default Following;
