import React, { Component, Fragment } from 'react';
import shortid from 'shortid';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';
import TagsDropdown from './TagsDropdown';

const TagBtn = styled(TextBtn)`
  border: 0px;
  margin: 0.2em;
  background: white;
  color: black;
  /* stylelint-disable */
  border: 1px solid ${props => (props.selected ? 'black' : 'white')};
  /* stylelint-enable */
`;

export default class TagsWindow extends Component {
  static propTypes = {};
  state = { selectedTags: [] };

  isSelected = tag => {
    return this.state.selectedTags.includes(tag);
  };

  onClickTag = tag => {
    const isSelected = this.state.selectedTags.includes(tag);

    let selectedTags;

    if (isSelected) {
      selectedTags = this.state.selectedTags.filter(t => t !== tag);
    } else {
      selectedTags = [...this.state.selectedTags, tag];
    }
    this.setState({ selectedTags });
  };

  render() {
    const { tags, onSelect, onClose } = this.props;
    const { selectedTags } = this.state;

    return (
      <TagsDropdown
        topComponent={
          <Fragment>
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
          </Fragment>
        }
        bottomComponent={
          <Fragment>
            <TextBtn
              onClick={() => {
                onSelect(selectedTags);
              }}
              style={{ marginRight: '1em' }}
            >
              Select
            </TextBtn>
            <TextBtn onClick={onClose}>Close</TextBtn>
          </Fragment>
        }
      />
    );
  }
}
