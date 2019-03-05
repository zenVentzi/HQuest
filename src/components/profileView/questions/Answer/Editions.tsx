import React from "react";
import styled from "styled-components";
import Panel from "./Panel";
import Edition from "./Edition";
import { AnswerFieldsEditions } from "GqlClient/autoGenTypes";

interface EditionsProps {
  editions: AnswerFieldsEditions[] | null;
  onClose: () => void;
}

const Editions = (props: EditionsProps) => {
  const { editions, onClose } = props;

  if (!editions) {
    return (
      <Panel /* onClose={onClose} */>
        <div>No editions</div>
      </Panel>
    );
  }

  return (
    <Panel /* onClose={onClose} */>
      {editions.map(e => (
        <Edition key={e.id} edition={e} />
      ))}
    </Panel>
  );
};

export default Editions;
