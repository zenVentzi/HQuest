import React from "react";
import styled from "styled-components";
import User from "Reusable/UserRow";
import { getTime } from ".";
import AnsweredQuestion from "../profileView/questions/AnsweredQuestion";
import {
  AnswerNewsFieldsFragment,
  NewsBase,
  NewsType
} from "GqlClient/autoGenTypes";

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
  news: AnswerNewsFieldsFragment & NewsBase;
}

const NewAnswerEdition = ({
  news: { type, performer, question, createdOn }
}: NewAnswerEditionProps) => {
  let text;

  switch (type) {
    case NewsType.NewAnswer:
      text = `Added new answer ${getTime(createdOn)}:`;
      break;
    case NewsType.NewAnswerEdition:
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
        <AnsweredQuestion
          question={question}
          showComments={false}
          isPersonal={false}
          totalQuestionsCount={0}
          //TODO fix hardcoded values
        />
      </Body>
    </NewAnswerWrapper>
  );
};

export default NewAnswerEdition;
