import React, { useState } from "react";
import { AnswerFieldsEditions } from "GqlClient/autoGenTypes";
import styled from "styled-components";

const StyledSelect = styled.select`
  background: black;
  color: white;
  border: 2px solid white;
  text-align: center;
`;

interface EditionPickerProps {
  allEditions: AnswerFieldsEditions[];
  pickedEditionId?: string;
  onPickEdition: (all: boolean, pickedEditionId?: string) => void;
}

const EditionPicker = (props: EditionPickerProps) => {
  const editions: React.ReactElement[] = [];

  const getEditionText = (editionIndex: number) => {
    return editionIndex === 0
      ? `1'st edition`
      : editionIndex === 1
      ? `2'nd edition`
      : `${editionIndex + 1}'th edition`;
  };

  for (let i = 0; i < props.allEditions.length; i++) {
    // console.log(props.allEditions[i]);
    editions.push(
      <option key={props.allEditions[i].id} value={props.allEditions[i].id}>
        {getEditionText(i)}
      </option>
    );
  }

  return (
    <StyledSelect
      value={props.pickedEditionId || "all"}
      onChange={e => {
        if (e.target.value === "all") {
          props.onPickEdition(true);
        } else {
          props.onPickEdition(false, e.target.value);
        }
      }}
    >
      <option value="all">All</option>
      {editions.reverse()}
    </StyledSelect>
  );
};

export default EditionPicker;
