import React from 'react';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

const StyledDropdown = styled.div`
  width: 80%;
  border: 0.1em solid white;
  justify-content: center;
  padding: 1em;
  display: flex;
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
