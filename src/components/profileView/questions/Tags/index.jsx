import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Query } from 'react-apollo';
import { GET_QUESTIONS_TAGS } from 'Queries';
import Anchor from 'Reusable/Anchor';
import TagsWindow from './TagsWindow';
import TagsDropdown from './TagsDropdown';

const TagsHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;
  padding-left: 1.8em;
`;

const InvalidText = styled.div`
  color: red;
`;

const Input = styled.input`
  width: 40%;
  margin-right: 1em;

  @media (max-width: 600px) {
    width: 90%;
    margin-right: 0.5em;
  }
`;

const TagsWrapper = styled.div`
  position: relative;
  margin-bottom: 1em;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

class QuestionTags extends PureComponent {
  static propTypes = {};
  state = {
    showAllTags: false,
    selectedTags: [],
    matchingTags: [],
    invalidTag: null,
  };
  inputRef = React.createRef();

  hideAllTagsWindow = () => {
    this.setState(prevState => {
      return { ...prevState, showAllTags: false };
    });
  };

  onSelectFromWindow = selectedTags => {
    this.setState(
      prevState => {
        return { ...prevState, selectedTags };
      },
      () => {
        this.notifyParents();
      }
    );

    this.inputRef.current.value = `${selectedTags.join(',')},`;
    this.inputRef.current.focus();
    this.hideAllTagsWindow();
  };

  onSelectFromDropdown = selectedTag => {
    const { selectedTags } = this.state;
    selectedTags.push(selectedTag);
    this.inputRef.current.value = `${selectedTags.join(',')},`;
    this.setState(
      prevState => {
        return { ...prevState, selectedTags, matchingTags: [] };
      },
      () => {
        this.notifyParents();
      }
    );
    this.inputRef.current.focus();
  };

  setInvalidTag = msg => {
    this.setState(prevState => {
      return { ...prevState, invalidTagMsg: msg };
    });
  };

  clearInvalidTag = () => {
    this.setState(prevState => {
      return { ...prevState, invalidTagMsg: null };
    });
  };

  addToSelected = tag => {
    this.setState(
      prevState => {
        const { selectedTags } = prevState;
        return { ...prevState, selectedTags: [...selectedTags, tag] };
      },
      () => {
        this.notifyParents();
      }
    );
  };

  removeLastSelectedTag = () => {
    this.setState(
      prevState => {
        const selectedTags = [...prevState.selectedTags];
        selectedTags.pop();
        return { ...prevState, selectedTags };
      },
      () => {
        this.notifyParents();
      }
    );
  };

  clearSelectedTags = () => {
    this.setState(prevState => {
      return { ...prevState, selectedTags: [] };
    });
  };

  setInputToSelected = () => {
    const { selectedTags } = this.state;
    this.inputRef.current.value = `${selectedTags.join(',')},`;
    this.clearMatchingTags();
    this.clearInvalidTag();
  };

  notifyParents = () => {
    const { selectedTags } = this.state;
    this.props.onSelected(selectedTags);
  };

  updateMatchingTags = matchingTags => {
    this.setState(prevState => {
      return { ...prevState, matchingTags };
    });
  };

  clearMatchingTags = () => {
    this.setState(prevState => {
      return { ...prevState, matchingTags: [] };
    });
  };

  getInputSelection = node => {
    const startPos = node.selectionStart;
    const endPos = node.selectionEnd;
    return { startPos, endPos };
  };

  handleBackspaceOrDelete = e => {
    const key = e.keyCode || e.charCode;

    if (key === 8 || key === 46) {
      this.removeLastSelectedTag();
      this.setInputToSelected();
    }
  };

  moveCursorToEnd = () => {
    if (this.inputRef.current.value) {
      // const val = this.inputRef.current.value; // store the value of the element
      // console.log('TCL: QuestionTags -> moveCursorToEnd -> val', val);
      // this.inputRef.current.value = ''; // clear the value of the element
      // this.inputRef.current.value = val; // set that value back.
      // eslint-disable-next-line
      this.inputRef.current.selectionStart = this.inputRef.current.selectionEnd = 100000;
    }
  };

  onClickInput = () => {
    this.moveCursorToEnd();
  };

  onKeyDownInput = event => {
    this.moveCursorToEnd();
    this.handleBackspaceOrDelete(event);
  };

  checkTagSelected = tag => {
    const { selectedTags } = this.state;
    return selectedTags.includes(tag);
  };

  onChangeInput = e => {
    const {
      target: { value },
    } = e;
    const trimmed = value.trim();
    if (value.charAt(value.length - 1) === ' ') {
      this.inputRef.current.value = trimmed;
      return;
    } else if (trimmed.includes(',,')) {
      this.inputRef.current.value = trimmed.slice(0, -1);
      return;
    }

    const enteredTags = trimmed.split(',').filter(t => !!t);
    const lastTag = enteredTags[enteredTags.length - 1];

    const lastChar = trimmed.charAt(trimmed.length - 1);
    if (lastChar === ',') {
      const lastTagExists = this.allTags.includes(lastTag);
      if (!lastTagExists) {
        this.setInvalidTag(`Tag ${lastTag} does not exist`);
        return;
      }

      const alreadySelected = this.checkTagSelected(lastTag);
      if (alreadySelected) {
        this.setInputToSelected();
        return;
      }

      this.addToSelected(lastTag);
      this.clearMatchingTags();
    } else {
      const matchingTags = this.allTags.filter(t => t.includes(lastTag));
      this.updateMatchingTags(matchingTags);
    }

    /*  
    if backspace or delete, delete the whole previous word
    How to detect backspace or delte
    */
  };

  toggleAllTags = show => () => {
    this.setState(prevState => {
      return { ...prevState, showAllTags: show };
    });
  };

  render() {
    const { showAllTags, matchingTags, invalidTagMsg } = this.state;

    return (
      <Query query={GET_QUESTIONS_TAGS} errorPolicy="all">
        {({ loading, error, data: { questionsTags: tags } }) => {
          this.allTags = tags;

          return (
            <TagsWrapper>
              {showAllTags && (
                <TagsWindow
                  tags={tags}
                  onSelect={this.onSelectFromWindow}
                  onClose={this.hideAllTagsWindow}
                />
              )}
              <TagsHeader>
                <Input
                  ref={this.inputRef}
                  placeholder="Search by tag..."
                  onClick={this.onClickInput}
                  onChange={this.onChangeInput}
                  onKeyDown={this.onKeyDownInput}
                  type="text"
                />
                <Anchor onClick={this.toggleAllTags(true)}>all</Anchor>
              </TagsHeader>
              {invalidTagMsg && <InvalidText>{invalidTagMsg}</InvalidText>}
              {matchingTags.length > 0 && (
                <TagsDropdown
                  tags={matchingTags}
                  onSelect={this.onSelectFromDropdown}
                />
              )}
            </TagsWrapper>
          );
        }}
      </Query>
    );
  }
}

export default QuestionTags;
