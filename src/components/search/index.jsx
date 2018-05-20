import React from 'react';
import { connect } from 'react-redux';
import { parse } from 'qs';
import StyledContentComponent from '../.reusable/StyledContentComponent';
import User from './User';

// { match: { url, params } }
const Search = (props) => {
  const query = parse(window.location.search.substr(1));

  // return (<div>Search page for {query.match}</div>);
  const renderUsers = () => {
    if (props.users.length === 0) {
      return null;
    }

    const users = props.users.map((user) => {
      // console.log(user.id)

      return (
        <User
          key={user.id}
          avatarSrc={user.avatarSrc}
          username={user.name}
        />
      );
    });

    return users;
  };

  return (
    <StyledContentComponent>
      {renderUsers()}
    </StyledContentComponent>
  );
};

function mapStateToProps(state) {
  return { users: state.users.items };
}

// const mapDispatchToProps = dispatch => ({
//   edit: (questionId, answer) => {
//     dispatch(editAnswer(questionId, answer));
//   },
// });

export default connect(mapStateToProps, null)(Search);
