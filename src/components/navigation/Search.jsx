import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import TextInput from '../reusable/TextInput';
import UsersDataList from './UsersDataList';

const GET_USERS = gql`
  query GetUsers($match: String) {
    users(match: $match) {
      id
      fullName
    }
  }
`;

const CustomTextInput = styled(TextInput)`
  margin-top: 0.5em;
`;

class CustomSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { input: `` };
  }

  render() {
    const vars = { match: this.state.input };
    return (
      <form action="/search">
        <CustomTextInput
          list="users"
          name="match"
          autoComplete="off"
          placeholder="Search users.."
          onChange={e => {
            this.setState({ input: e.target.value });
          }}
        />
        {this.state.input.length > 1 && (
          <Query query={GET_USERS} variables={vars}>
            {({ loading, error, data: { users } }) => {
              if (loading) return <div> loading users </div>;
              if (error) return <div> {error} </div>;

              if (!users.length) {
                return <div> No matches found </div>;
              }

              return <UsersDataList users={users} />;
            }}
          </Query>
        )}
      </form>
    );
  }
}

export default CustomSearch;
