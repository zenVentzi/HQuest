import React from 'react';
import { Query } from 'react-apollo';
import FixedPanel from 'Reusable/FixedPanel';
import User from 'Reusable/UserRow';
import { GET_FOLLOWING } from 'Queries';

const Following = ({ userId, onClose }) => {
  return (
    <Query query={GET_FOLLOWING} variables={{ userId }}>
      {({ loading, error, data: { following } }) => {
        if (loading) return <div> Loading following..</div>;
        if (error) return <div> {error.message} </div>;

        return (
          <FixedPanel onClose={onClose}>
            {following.map(f => (
              <User key={f.id} user={f} />
            ))}
          </FixedPanel>
        );
      }}
    </Query>
  );
};

export default Following;
