import React from 'react';
import { Query } from 'react-apollo';
import FloatingWindow from 'Reusable/FloatingWindow';
import User from 'Reusable/UserRow';
import { GET_FOLLOWERS } from 'Queries';

const Followers = ({ userId, onClose }) => {
  return (
    <Query query={GET_FOLLOWERS} variables={{ userId }}>
      {({ loading, error, data: { followers } }) => {
        if (loading) return <div> Loading followers..</div>;
        if (error) return <div> {error.message} </div>;

        return (
          <FloatingWindow onClose={onClose}>
            {followers.map(f => (
              <User inversedColors size={2} key={f.id} user={f} />
            ))}
          </FloatingWindow>
        );
      }}
    </Query>
  );
};

export default Followers;
