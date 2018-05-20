import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { fetchUsers } from '../../../actions/actionCreators';
import Search from '../../.reusable/Search';
import UsersDataList from './UsersDataList';

const CustomSearchStyled = styled(Search)`
  margin-top: 0.5em;`;

const CustomSearch = (props) => {
  const onKeyUp = (e) => {
    const enterKeyCode = 13;
    const input = e.target.value;

    if (input.length < 2 || !e.keyCode) {
      return;
    }

    if (e.keyCode === enterKeyCode) {
      // route to search page
      return;
    }

    // populate datalist wtih first 5 matches
    // 1) Fetch user names that match. On callback
    // 2) Update the datalist options with those names on callback

    props.fetchMatchingUsers(input);
  };

  return (
    <React.Fragment>
      <form action="/search">
        <CustomSearchStyled
          list="users"
          name="match"
          placeholder="Search users.."
          onKeyUp={onKeyUp}
        />
        <UsersDataList />
      </form>
    </React.Fragment>
  );
};

const mapDispatchToProps = dispatch => ({
  fetchMatchingUsers: (input) => {

    dispatch(fetchUsers(input));
  },
});

export default connect(null, mapDispatchToProps)(CustomSearch);
