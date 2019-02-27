import React from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import { NewsType } from "../../constants";
import { getTime } from ".";
// import { NewsType } from 'Constants';
import AnsweredQuestion from "../profileView/questions/AnsweredQuestion";

const { NEW_ANSWER_EDITION, NEW_ANSWER } = NewsType;

const NewAnswerWrapper = styled.div`
  width: 100%;
  margin-bottom: 1em;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1em;
  border-bottom: 2px solid white;
`;
const HeaderTop = styled.div`
  /* flex-grow: 3; */
`;
const HeaderBottom = styled.div`
  /* flex-grow: 1; */
  font-size: 0.8em;
`;
const Body = styled.div``;

interface NewAnswerEditionProps {
  news: any;
}

const NewAnswerEdition = ({
  news: { type, performer, question, createdOn }
}: NewAnswerEditionProps) => {
  let text;

  switch (type) {
    case NEW_ANSWER:
      text = `Added new answer ${getTime(createdOn)}:`;
      break;
    case NEW_ANSWER_EDITION:
      text = `Edited answer ${getTime(createdOn)}:`;
      break;
    default:
      break;
  }
  return (
    <NewAnswerWrapper>
      <Header>
        <HeaderTop>
          <User user={performer} size={1.5} />
        </HeaderTop>
        <HeaderBottom>{text}</HeaderBottom>
      </Header>
      <Body>
        <AnsweredQuestion collapseComments question={question} />
      </Body>
    </NewAnswerWrapper>
  );
};

export default NewAnswerEdition;
