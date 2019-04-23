import React, { useState } from "react";
import shortid from "shortid";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";
import TagsDropdown from "./TagsDropdown";

interface TagBtnProps {
  selected: boolean;
}

const TagBtn = styled(TextBtn)<TagBtnProps>`
  border: 0px;
  margin: 0.2em;
  background: white;
  color: black;
  /* stylelint-disable */
  border: 1px solid ${props => (props.selected ? "black" : "white")};
  /* stylelint-enable */
`;

interface TagsWindowProps {
  tags: string[];
  onSelect: (selectedTags: string[]) => void;
  onClose: () => void;
}

const TagsWindow = (props: TagsWindowProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const isSelected = (tag: string) => {
    return selectedTags.includes(tag);
  };

  const onClickTag = (tag: string) => {
    if (isSelected(tag)) {
      setSelectedTags(() => {
        return selectedTags.filter((t: string) => t !== tag);
      });
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const { tags, onSelect, onClose } = props;

  return (
    <TagsDropdown
      topComponent={
        <>
          {tags.map(t => (
            <TagBtn
              key={t}
              onClick={e => {
                e.stopPropagation();
                onClickTag(t);
              }}
              selected={isSelected(t)}
            >
              {t}
            </TagBtn>
          ))}
        </>
      }
      bottomComponent={
        <>
          <TextBtn
            onClick={() => {
              onSelect(selectedTags);
            }}
            style={{ marginRight: "1em" }}
          >
            Select
          </TextBtn>
          <TextBtn onClick={onClose}>Close</TextBtn>
        </>
      }
    />
  );
};

export default TagsWindow;
