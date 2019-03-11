import React, { useState } from "react";

interface EditionDropdownProps {
  numOfEditions: number;
}

const EditionDropdown = (props: EditionDropdownProps) => {
  const [edition, setEdition] = useState<string>(String(props.numOfEditions));
  let editions = [];

  for (let i = 0; i < props.numOfEditions; i++) {
    editions.push();
  }
  return (
    <select
      value={edition}
      onChange={e => {
        setEdition(e.target.value);
      }}
    >
      <option value="all">All</option>
      {editions}
      <option value="saab">Saab</option>
      <option value="opel">Opel</option>
      <option value="audi">Audi</option>
    </select>
  );
};

export default EditionDropdown;
