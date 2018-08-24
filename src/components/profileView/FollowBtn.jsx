import React, { Component } from 'react';
import styled from 'styled-components';

const Btn = styled.button`
  margin-bottom: 1em;
`;

class FollowBtn extends Component {
  state = { hovered: false };

  onMouseEnter = () => {
    this.setState({ hovered: true });
  };

  onMouseLeave = () => {
    this.setState({ hovered: false });
  };

  render() {
    const { following } = this.props;
    const normalText = following ? `Following` : `Follow`;
    const hoverText = following ? `Unfollow` : `Follow`;
    const text = this.state.hovered ? hoverText : normalText;

    return (
      <Btn onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
        {text}
      </Btn>
    );
  }
}

export default FollowBtn;
