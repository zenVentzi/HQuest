import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import TextBtn from 'Reusable/TextBtn';
import gql from 'graphql-tag';
import styled from 'styled-components';

const FOLLOW = gql`
  mutation follow($userId: ID!, $follow: Boolean!) {
    follow(userId: $userId, follow: $follow)
  }
`;

const Btn = styled(TextBtn)`
  margin-bottom: 0.5em;
`;

class FollowBtn extends Component {
  state = { hovered: false, isFollowed: this.props.isFollowed };

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  onClick = mutation => async () => {
    const { userId } = this.props;
    const follow = !this.state.isFollowed;
    await mutation({ variables: { userId, follow } });
    const newState = { ...this.state, isFollowed: !this.state.isFollowed };
    this.setState(newState);
  };

  render() {
    const { hovered, isFollowed } = this.state;
    const normalText = isFollowed ? `Following` : `Follow`;
    const hoverText = isFollowed ? `Unfollow` : `Follow`;
    const text = hovered ? hoverText : normalText;

    return (
      <Mutation mutation={FOLLOW}>
        {follow => (
          <Btn
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            onClick={this.onClick(follow)}
          >
            {text}
          </Btn>
        )}
      </Mutation>
    );
  }
}

export default FollowBtn;
