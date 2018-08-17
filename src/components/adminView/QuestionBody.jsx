import React, { Fragment } from 'react';
import styled from 'styled-components';
import ScaleBody from './ScaleBody';
import OptionsBody from './OptionsBody';
import WouldYouSingleBody from './WouldYouSingleBody';
import { QuestionTypes } from './constants';

const CreateBtn = styled.button`
  margin-top: 0.5em;
`;

const QuestionBody = ({ questionType }) => {
  const {
    SCALE,
    TEXT,
    OPTIONS,
    WOULD_YOU_SINGLE,
    WOULD_YOU_DOUBLE,
  } = QuestionTypes;

  let Body;

  switch (questionType) {
    case SCALE:
      Body = ScaleBody;
      break;
    case TEXT:
      break;
    case OPTIONS:
      Body = OptionsBody;
      break;
    case WOULD_YOU_SINGLE:
      Body = WouldYouSingleBody;
      break;
    case WOULD_YOU_DOUBLE:
      break;
    default:
      return null;
  }

  return (
    <Fragment>
      <Body />
      <CreateBtn>Create</CreateBtn>
    </Fragment>
  );
};

export default QuestionBody;
