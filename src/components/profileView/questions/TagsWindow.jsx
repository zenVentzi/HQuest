import React, { Component } from 'react';
import shortid from 'shortid';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import GET_TAGS from 'Queries';
import FloatingWindow from 'Reusable/FloatingWindow';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

const TagBtn = styled(TextBtn)`
  border: 0px;
  & :active {
    background: white;
    color: black;
  }
`;

export default class TagsWindow extends Component {
  static propTypes = {};
  state = { selectedTags: [] };

  toggleSelected = tag => event => {
    event.stopPropagation();

    const { selectedTags } = this.state;
    const tagIndex = selectedTags.findIndex(t => t.id === tag.id);

    if (tagIndex) {
      selectedTags.splice(tagIndex, 1);
      event.target.blur();
    } else {
      selectedTags.push(tag);
      event.target.focus();
    }

    this.setState({ selectedTags });
  };

  render() {
    const { tags, onSelect } = this.props;
    const { selectedTags } = this.state;

    return (
      <FloatingWindow>
        {tags.map(t => (
          <TagBtn key={t.id}>{t}</TagBtn>
        ))}
        <TextBtn onClick={onSelect(selectedTags)}>Select</TextBtn>
      </FloatingWindow>
    );
  }
}
