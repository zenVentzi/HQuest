import React, { Component } from 'react';
import styled from 'styled-components';
import StyledView from '../reusable/StyledView';
import { QuestionTypes } from './constants';
import QuestionBody from './QuestionBody';

const TopText = styled.div`
  margin-bottom: 1em;
`;

const Select = styled.select`
  margin-bottom: 10em;
  background-color: black;
  border-radius: 0.5em;
  color: white;
`;

class AdminView extends Component {
  state = { questionType: QuestionTypes.WOULD_YOU_SINGLE };

  onOptionSelected = e => {
    const val = e.target.value;
    this.setState({ questionType: val });
  };

  render() {
    const { questionType } = this.state;

    return (
      <StyledView>
        <TopText>Add new question:</TopText>
        <Select value="default" onChange={this.onOptionSelected}>
          <option value="default" disabled>
            Type
          </option>
          <option value={QuestionTypes.SCALE}>Scale</option>
          <option value={QuestionTypes.TEXT}>Text</option>
          <option value={QuestionTypes.OPTIONS}>a)b)c)</option>
          <option value={QuestionTypes.WOULD_YOU_SINGLE}>Would-u-single</option>
          {/* <option value={QuestionTypes.WOULD_YOU_DOUBLE}>Would-u-double</option> */}
        </Select>
        {/* <div> ba </div> */}
        {questionType && <QuestionBody questionType={questionType} />}
      </StyledView>
    );
  }
}

export default AdminView;
