import React from 'react';
import { Query } from 'react-apollo';
import FixedPanel from 'Reusable/FixedPanel';
import User from 'Reusable/UserRow';
import { GET_FOLLOWERS } from 'Queries';

const Followers = ({ userId, onClose }) => {
  return (
    <Query query={GET_FOLLOWERS} variables={{ userId }}>
      {({ loading, error, data: { followers } }) => {
        if (loading) return <div> Loading followers..</div>;
        if (error) return <div> {error.message} </div>;

        return (
          <FixedPanel onClose={onClose}>
            {followers.map(f => (
              <User key={f.id} user={f} />
            ))}
          </FixedPanel>
        );
      }}
    </Query>
  );
};

export default Followers;
