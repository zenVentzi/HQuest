import React, { Fragment } from 'react';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';
import TagsDropdown from './TagsDropdown';

const MatchingTags = ({ tags, onSelect: onSelectProp }) => {
  const onSelect = tag => () => {
    onSelectProp(tag);
  };
  return (
    <TagsDropdown
      topComponent={
        <Fragment>
          {tags.map(t => (
            <TextBtn onClick={onSelect(t)} key={t}>
              {t}
            </TextBtn>
          ))}
        </Fragment>
      }
    />
  );
};

export default MatchingTags;
