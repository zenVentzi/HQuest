import React, { Component } from 'react';
import styled from 'styled-components';
import { iconBtn } from 'Reusable/css';
import TextBtn from 'Reusable/TextBtn';
import IconBtn from 'Reusable/IconBtn';
import { CaretSquareDown } from 'styled-icons/fa-solid/CaretSquareDown';
import DropdownWrapper from 'Reusable/DropdownWrapper';
import DropdownList from 'Reusable/DropdownList';

const CaretBtn = styled(CaretSquareDown)`
  ${iconBtn};
  margin-top: 0.5em;
`;

class QuestionOptions extends Component {
  state = {
    showDropdown: false,
  };

  onClickOutsideDropdown = e => {
    const carretBtnClicked = this.isClickOnCaretBtn(e.target);
    if (carretBtnClicked) return;
    this.toggleDropdown();
  };

  isClickOnCaretBtn = target => {
    const buttonWrapper = this.caretBtn.current;
    const btnChildren = buttonWrapper.querySelectorAll('*');

    return target === buttonWrapper || [...btnChildren].includes(target);
  };

  caretBtn = React.createRef();

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  render() {
    const { showDropdown } = this.state;
    const { hideIcon: hideIconProp, onClickEdit, onClickRemove } = this.props;

    const options = [
      <TextBtn key="edit" onClick={onClickEdit}>
        Edit
      </TextBtn>,
      <TextBtn key="Remove" onClick={onClickRemove}>
        Remove
      </TextBtn>,
    ];

    const hideIcon = hideIconProp && !showDropdown;

    return (
      <DropdownWrapper>
        <CaretBtn
          innerRef={this.caretBtn}
          onClick={this.toggleDropdown}
          size="1em"
          hide={hideIcon}
        />
        {showDropdown && (
          <DropdownList
            marginTop="1.8em"
            pivot="right"
            items={options}
            onClickOutside={this.onClickOutsideDropdown}
          />
        )}
      </DropdownWrapper>
    );
  }
}

export default QuestionOptions;
