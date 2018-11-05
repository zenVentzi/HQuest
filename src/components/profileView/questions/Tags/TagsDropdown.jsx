import React from 'react';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

const StyledDropdown = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  position: absolute;
  top: 2.3em;
  width: 57%;
  background: white;
  border-radius: 0.2em;
  border: 0.1em solid black;
  padding: 0.2em;
`;

const TagsDropdown = ({ tags, onSelect: onSelectProp }) => {
  const onSelect = tag => () => {
    onSelectProp(tag);
  };
  return (
    <StyledDropdown>
      {tags.map(t => (
        <TextBtn onClick={onSelect(t)} key={t}>
          {t}
        </TextBtn>
      ))}
    </StyledDropdown>
  );
};

export default TagsDropdown;
