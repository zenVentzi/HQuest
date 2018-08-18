import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
// import StyledView from '../reusable/StyledView';
import { QuestionTypes } from './constants';
import QuestionBody from './QuestionBody';
import Navbar from '../navigation';

const TopText = styled.div`
  margin-bottom: 1em;
`;

const Select = styled.select`
  margin-bottom: 8em;
  background-color: black;
  border-radius: 0.5em;
  color: white;
`;

const StyledView = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 70px auto;
  align-items: center;
  text-align: center;
  width: 500px;
  overflow: hidden;
`;

class AdminView extends Component {
  state = { questionType: 'default', successMsg: null };

  onOptionSelected = e => {
    const val = e.target.value;
    this.setState({ questionType: val, successMsg: null });
  };

  onQuestionAdded = () => {
    const successMsg = `Question was successfully added!`;
    this.setState(oldState => ({
      ...oldState,
      questionType: `default`,
      successMsg,
    }));
  };

  render() {
    const { questionType, successMsg } = this.state;

    return (
      <Fragment>
        <Navbar />
        <StyledView>
          <TopText>Add new question:</TopText>
          <Select value={questionType} onChange={this.onOptionSelected}>
            <option value="default" disabled>
              Type
            </option>
            <option value={QuestionTypes.SCALE}>Scale</option>
            <option value={QuestionTypes.TEXT}>Text</option>
            <option value={QuestionTypes.OPTIONS}>a)b)c)</option>
            <option value={QuestionTypes.WOULD_YOU_SINGLE}>
              Would-you-single
            </option>
            {/* <option value={QuestionTypes.WOULD_YOU_DOUBLE}>Would-u-double</option> */}
          </Select>
          {successMsg && <div>{successMsg}</div>}
          <hr />
          {questionType && (
            <QuestionBody
              questionType={questionType}
              onAdded={this.onQuestionAdded}
            />
          )}
        </StyledView>
      </Fragment>
    );
  }
}

export default AdminView;
