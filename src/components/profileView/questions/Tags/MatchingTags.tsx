import React, { Fragment } from "react";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";
import TagsDropdown from "./TagsDropdown";

interface MatchingTagsProps {
  tags: string[];
  onSelect: (tag: string) => void;
}

const MatchingTags = ({ tags, onSelect: onSelectProp }: MatchingTagsProps) => {
  const onSelect = (tag: string) => () => {
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
