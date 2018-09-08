import React from 'react';
import { Query } from 'react-apollo';
import FloatingWindow from 'Reusable/FloatingWindow';
import User from 'Reusable/UserRow';
import { GET_FOLLOWING } from 'Queries';

const Following = ({ userId, onClose }) => {
  return (
    <Query query={GET_FOLLOWING} variables={{ userId }}>
      {({ loading, error, data: { following } }) => {
        if (loading) return <div> Loading following..</div>;
        if (error) return <div> {error.message} </div>;

        return (
          <FloatingWindow onClose={onClose}>
            {following.map(f => (
              <User inversedColors size={2} key={f.id} user={f} />
            ))}
          </FloatingWindow>
        );
      }}
    </Query>
  );
};

export default Following;
