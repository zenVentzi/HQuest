import React from 'react';
import distanceInWords from 'date-fns/distance_in_words';
import styled from 'styled-components';
import User from 'Reusable/UserRow';
import AnsweredQuestion from '../profileView/questions/AnsweredQuestion';

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

const getTime = createdOn => {
  const startDate = new Date(createdOn).getTime();
  const dateTimeNow = new Date().getTime();

  const res = distanceInWords(startDate, dateTimeNow, {
    includeSeconds: true,
  });

  return `${res} ago`;
};

const NewAnswer = ({ news: { performer, question, createdOn } }) => {
  // console.log(createdOn);
  return (
    <NewAnswerWrapper>
      <Header>
        <HeaderTop>
          <User user={performer} size={1.5} />
        </HeaderTop>
        <HeaderBottom> Added new answer {getTime(createdOn)}:</HeaderBottom>
      </Header>
      <Body>
        <AnsweredQuestion collapseComments question={question} />
      </Body>
    </NewAnswerWrapper>
  );
};

export default NewAnswer;
