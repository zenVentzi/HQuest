import React from 'react';
import RatingUnit from './RatingUnit';
import style from './css/rating.css';

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
      <div className="answer-edit">
        <div className="answer-keywords">
          <i>Never </i>
          <i>Sometimes </i>
          <i>Always</i>
        </div>

        {this.state.ratingUnits.map(unit => (
          <RatingUnit
            key={unit.id}
            id={unit.id}
            active={unit.active}
            clickHandler={this.handleUnitClick}
          />
        ))}
      </div>);
  }
}

export default Rating;
