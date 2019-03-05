import React from "react";
import distanceInWords from "date-fns/distance_in_words";
import styled from "styled-components";
import { AnswerFieldsEditions } from "GqlClient/autoGenTypes";

const StyledEdition = styled.div`
  width: 80%;
  ${"" /* color: black; */} margin-bottom: 0.8em;
`;

const Text = styled.div``;

const AnswerText = styled.span`
  font-family: Arial, Helvetica, sans-serif;

  font-style: italic;
  text-decoration: none;
`;

interface EditionProps {
  edition: AnswerFieldsEditions;
}

const Edition = ({ edition: { date, before, after } }: EditionProps) => {
  const editDate = new Date(date).getTime();
  const dateTimeNow = new Date().getTime();

  const editedTimeAgo = distanceInWords(editDate, dateTimeNow);

  return (
    <StyledEdition
    // onMouseEnter={onMouseEnter}
    // onMouseLeave={onMouseLeave}
    >
      <Text>Edit {editedTimeAgo} ago</Text>
      <Text>
        Before: <AnswerText>{before}</AnswerText>
      </Text>
      <Text>
        After: <AnswerText>{after}</AnswerText>
      </Text>
    </StyledEdition>
  );
};

export default Edition;
