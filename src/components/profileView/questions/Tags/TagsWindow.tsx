import React, { Component } from "react";
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

export default class TagsWindow extends Component<TagsWindowProps, any> {
  static propTypes = {};
  state: any = { selectedTags: [] };

  isSelected = (tag: string) => {
    return this.state.selectedTags.includes(tag);
  };

  onClickTag = (tag: string) => {
    const isSelected = this.state.selectedTags.includes(tag);

    let selectedTags;

    if (isSelected) {
      selectedTags = this.state.selectedTags.filter((t: string) => t !== tag);
    } else {
      selectedTags = [...this.state.selectedTags, tag];
    }
    this.setState({ selectedTags });
  };

  render() {
    const { tags, onSearch } = this.props;
    const { selectedTags } = this.state;

    return (
      <StyledDropdown>
        <Top>
          {tags.map(t => (
            <TagBtn
              key={t}
              onClick={e => {
                e.stopPropagation();
                this.onClickTag(t);
              }}
              selected={this.isSelected(t)}
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
  }
}
