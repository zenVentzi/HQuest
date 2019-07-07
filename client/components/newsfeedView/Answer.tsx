import React from "react";
import styled from "styled-components";
import User from "./UserRow";
import { getTime } from ".";
import AnsweredQuestion from "../profileView/questions/AnsweredQuestion";
import {
  NewAnswerEditionNewsFieldsFragment,
  NewsBase,
  NewsType
} from "GqlClient/autoGenTypes";

const NewAnswerWrapper = styled.div`
  width: 100%;
  margin-bottom: 20px;
  background-color: white;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1em;
  color: black;
  /* border-bottom: 2px solid white; */
`;
const HeaderTop = styled.div`
  /* flex-grow: 3; */
`;
const HeaderBottom = styled.div`
  /* flex-grow: 1; */
  font-size: 16px;
`;
const Body = styled.div``;

interface NewAnswerEditionProps {
  news: NewAnswerEditionNewsFieldsFragment & NewsBase;
}

const NewAnswerEdition = ({
  news: { type, performer, question, createdOn }
}: NewAnswerEditionProps) => {
  let text;

  switch (type) {
    case NewsType.NewAnswerEdition:
      text = `Added new edition ${getTime(createdOn)}:`;
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
