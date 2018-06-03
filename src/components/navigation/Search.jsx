import React, { Component } from 'react';
import styled from 'styled-components';
import TextInput from '../.reusable/TextInput';
import UsersDataList from './UsersDataList';

const CustomTextInput = styled(TextInput)`
  margin-top: 0.5em;`;

class CustomSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <form action="/search">
        <CustomTextInput
          list="users"
          name="match"
          placeholder="Search users.."
          onChange={(e) => {
            this.setState({ input: e.target.value });
          }}
        />
        {this.state.input && <UsersDataList match={this.state.input} />}
      </form>
    );
  }
}

export default CustomSearch;
