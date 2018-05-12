import React from 'react';
import styled from 'styled-components';
import RatingUnit from './RatingUnit';

const StyledRating = styled.div``;

const UNITS_LENGTH = 7;

class Rating extends React.Component {
  componentWillMount() {
    // super(props);
    const ratingUnits = [];

    for (let i = 0; i < UNITS_LENGTH; i += 1) {
      ratingUnits.push({
        id: i,
        active: false,
      });
    }

    this.setState({ ratingUnits });
    this.handleUnitClick = this.handleUnitClick.bind(this);
  }

  handleUnitClick(unitId) {
    const newState = { ...this.state };

    for (let i = 0; i < UNITS_LENGTH; i += 1) {
      const active = i <= unitId;
      newState.ratingUnits[i].active = active;
    }

    this.setState(newState);
  }

  render() {
    return (
      <StyledRating>
        {this.state.ratingUnits.map(unit => (
          <RatingUnit
            key={unit.id}
            id={unit.id}
            active={unit.active}
            clickHandler={this.handleUnitClick}
          />
        ))}
      </StyledRating>);
  }
}

export default Rating;
