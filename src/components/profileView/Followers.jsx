import React from 'react';
import { Query } from 'react-apollo';
import FloatingWindow from 'Reusable/FloatingWindow';
import User from 'Reusable/UserRow';
import { GET_FOLLOWERS } from 'Queries';
import WhitePanel from 'Reusable/WhitePanel';

const Followers = ({ userId, onClose }) => {
  return (
    <WhitePanel onClose={onClose}>
      <Query query={GET_FOLLOWERS} variables={{ userId }}>
        {({ loading, error, data: { followers } }) => {
          if (loading)
            return <div style={{ color: 'black' }}> Loading following..</div>;
          if (error)
            return <div style={{ color: 'black' }}> {error.message} </div>;

          return followers.map(f => (
            <User inversedColors size={2} key={f.id} user={f} />
          ));
        }}
      </Query>
    </WhitePanel>
  );
};

export default Followers;
