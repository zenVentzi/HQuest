import React from 'react';
import { parse } from 'qs';
import StyledContentComponent from '../.reusable/StyledContentComponent';
import User from './User';
import { fetchUsers } from '../../actions/actionCreators';

// { match: { url, params } }
class Search extends React.Component {
  constructor(props) {
    super(props);

    const query = parse(window.location.search.substr(1));
    props.fetchMatchingUsers(query.match);
  }

  renderUsers() {
    const users = this.props.users.map((user) => {
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
  }

  renderNotFound() {
    return (<div> No matches found </div>);
  }

  renderSearch() {
    const hasMatchingUsers = this.props.users.length > 0;

    if (hasMatchingUsers) {
      return this.renderUsers();
    }

    return this.renderNotFound();
  }

  render() {
    return (
      <StyledContentComponent>
        {this.renderSearch()}
      </StyledContentComponent>
    );
  }
}

export default Search;
