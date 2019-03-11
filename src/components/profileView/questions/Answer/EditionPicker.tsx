import React, { useState } from "react";
import { AnswerFieldsEditions } from "GqlClient/autoGenTypes";

interface EditionPickerProps {
  allEditions: AnswerFieldsEditions[];
  pickedEditionId?: string;
  onPickEdition: (all: boolean, pickedEditionId?: string) => void;
}

const EditionPicker = (props: EditionPickerProps) => {
  const editions: React.ReactElement[] = [];

  for (let i = 0; i < props.allEditions.length; i--) {
    editions.push(
      <option value={props.allEditions[i].id}>{i + 1}'th edition</option>
    );
  }
  editions.reverse();

  return (
    <select
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
      {editions}
    </select>
  );
};

export default EditionPicker;
