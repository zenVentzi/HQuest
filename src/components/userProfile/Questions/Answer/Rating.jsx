import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import RatingUnit from './RatingUnit';
import { editAnswer } from '../../../../actions/actionCreators';
import { getAnswer } from '../../../../selectors';

const StyledRating = styled.div``;

class Rating extends React.Component {
  componentWillMount() {
    this.handleUnitClick = this.handleUnitClick.bind(this);
  }

  handleUnitClick(unitIndex) {
    const { questionId } = this.props;
    const newAnswer = unitIndex + 1;

    this.props.edit(questionId, newAnswer);
  }

  renderUnits() {
    const ratingUnits = [];

    for (let i = 0; i < 7; i += 1) {
      const active = i < this.props.rating;

      ratingUnits[i] = (
        <RatingUnit
          key={i}
          index={i}
          active={active}
          editMode={this.props.editMode}
          clickHandler={this.handleUnitClick}
        />
      );
    }

    return ratingUnits;
  }

  render() {
    return (
      <StyledRating>
        {this.renderUnits()}
      </StyledRating>);
  }
}

function mapStateToProps(state, ownProps) {
  const rating = getAnswer(state, ownProps.questionId);
  return { rating };
}

const mapDispatchToProps = dispatch => ({
  edit: (questionId, answer) => {
    dispatch(editAnswer(questionId, answer));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Rating);
