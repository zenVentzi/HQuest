import React, { useState } from "react";
import shortid from "shortid";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";

const StyledDropdown = styled.div`
  position: absolute;
  top: 2.3em;
  width: 100%;
  z-index: 1;
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  overflow-y: auto;
  justify-content: center;
  top: 0em;
  max-height: 10em;
  width: 100%;
  background: white;
  border-radius: 0.2em;
`;

const Bottom = styled.div`
  position: absolute;
  width: 100%;
  text-align: center;
  background: black;
`;

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
  onSearch: (selectedTags: string[]) => void;
}

const TagsWindow = (props: TagsWindowProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const isSelected = (tag: string) => {
    return selectedTags && selectedTags.includes(tag);
  };

  const onClickTag = (tag: string) => {
    if (isSelected(tag)) {
      setSelectedTags(selectedTags.filter((t: string) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const { tags, onSearch } = props;

  return (
    <StyledDropdown>
      <Top>
        {tags.map((t: string) => (
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
      </Top>
      <Bottom>
        <TextBtn
          onClick={() => {
            onSearch(selectedTags);
          }}
        >
          Search
        </TextBtn>
      </Bottom>
    </StyledDropdown>
  );
};

export default TagsWindow;
