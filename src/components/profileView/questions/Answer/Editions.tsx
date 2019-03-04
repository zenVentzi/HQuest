import React from "react";
import styled from "styled-components";
import Panel from "./Panel";
import Edition from "./Edition";

interface EditionsProps {
  editions: any[];
  onClose: () => void;
}

const Editions = (props: EditionsProps) => {
  const { editions, onClose } = props;

  return (
    <Panel /* onClose={onClose} */>
      {editions.map(e => (
        <Edition key={e.id} edition={e} />
      ))}
    </Panel>
  );
};

export default Editions;
