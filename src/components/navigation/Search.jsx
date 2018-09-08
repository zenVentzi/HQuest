import React, { Component } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import styled from 'styled-components';
import UsersDataList from './UsersDataList';

const GET_USERS = gql`
  query GetUsers($match: String) {
    users(match: $match) {
      id
      fullName
    }
  }
`;

const TextInput = styled.input`
  width: 20em;
`;

const CustomTextInput = styled(TextInput)`
  margin-top: 0.3em;
`;

class CustomSearch extends Component {
  constructor(props) {
    super(props);
    this.state = { input: `` };
    // this.datalistRef = null;
    this.datalistRef = React.createRef();
    // this.datalistRef.current
  }

  /* 
  problem: when click enter over a result, it doesn't submit the form
  */

  isOptionSelected = inputValue => {
    let res = false;
    if (this.datalistRef.current) {
      const options = this.datalistRef.current.childNodes;
      options.forEach(opt => {
        if (opt.value === inputValue) {
          res = true;
        }
      });
    }

    return res;
  };

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
            const val = e.target.value;
            this.optionWasSelected = this.isOptionSelected(val);
            this.setState({ input: val });
          }}
        />
        {this.state.input.length > 1 &&
          !this.optionWasSelected && (
            <Query
              query={GET_USERS}
              variables={vars}
              fetchPolicy="network-only"
            >
              {({ loading, error, data: { users } }) => {
                if (loading) return <div> loading users </div>;
                if (error) return <div> {error} </div>;

                if (!users.length) {
                  return <div> No matches found </div>;
                }

                return <UsersDataList users={users} ref={this.datalistRef} />;
              }}
            </Query>
          )}
      </form>
    );
  }
}

export default CustomSearch;
