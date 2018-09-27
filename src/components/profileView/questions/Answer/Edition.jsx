import React, { Component } from 'react';
import distanceInWords from 'date-fns/distance_in_words';
import styled from 'styled-components';

const StyledEdition = styled.div`
  width: 80%;
  color: black;
  margin-bottom: 0.8em;
`;

const Text = styled.div`
  color: black;
`;

// can be made stateless
class Edition extends Component {
  render() {
    const {
      edition: { date, before, after },
    } = this.props;

    const startDate = new Date(date).getTime();
    const dateTimeNow = new Date().getTime();

    const editedTimeAgo = distanceInWords(startDate, dateTimeNow);

    return (
      <StyledEdition
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
      >
        <Text>edit {editedTimeAgo} ago</Text>
        <Text>
          Before: <br /> {before}
        </Text>
        <Text>
          After: <br /> {after}
        </Text>
      </StyledEdition>
    );
  }
}

export default Edition;
