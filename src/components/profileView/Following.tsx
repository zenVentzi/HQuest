import React from "react";
import { Query } from "react-apollo";
import User from "Reusable/UserRow";
import { GET_FOLLOWING } from "Queries";
import WhitePanel from "Reusable/WhitePanel";

interface FollowingProps {
  userId: string;
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

const Following = ({ userId, onClose }: FollowingProps) => {
  return (
    <WhitePanel onClose={onClose}>
      <Query query={GET_FOLLOWING} variables={{ userId }}>
        {({ loading, error, data: { following } }) => {
          if (loading)
            return <div style={{ color: "black" }}> Loading following..</div>;
          if (error)
            return <div style={{ color: "black" }}> {error.message} </div>;

          return following.map((f: any) => (
            <User inversedColors size={2} key={f.id} user={f} />
          ));
        }}
      </Query>
    </WhitePanel>
  );
};

export default Following;
