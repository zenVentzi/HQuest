import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import DropdownList from 'Reusable/DropdownList';

const StyledDropdown = styled.div`
  display: inline-block;
  position: relative;
`;

class Dropdown extends Component {
  state = {
    showDropdown: false,
  };

  btnRef = React.createRef();

  componentDidMount() {
    const buttonHeight = this.btnRef.current.clientHeight;
    /* eslint-disable  */
    this.setState(prevState => ({ ...prevState, buttonHeight }));
    /* eslint-enable  */
  }

  onClickOutside = e => {
    if (this.isDropdownBtnClicked(e)) return;
    this.toggleDropdown();
  };

  onDropdownItemClicked = () => {
    this.toggleDropdown();
  };

  isDropdownBtnClicked = event => {
    return (
      event.target === this.btnRef.current ||
      event.target === this.btnRef.current.children[0]
    );
  };

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  renderDropdownBtn = () => {
    const { dropBtn } = this.props;

    return React.cloneElement(dropBtn, {
      ref: this.btnRef,
      onClick: () => {
        if (dropBtn.props.onClick) {
          dropBtn.props.onClick();
        }

        this.toggleDropdown();
      },
    });
  };

  render() {
    const { showDropdown, buttonHeight } = this.state;
    const { items, pivot } = this.props;

    return (
      <StyledDropdown>
        {this.renderDropdownBtn()}
        {showDropdown &&
          buttonHeight && (
            <DropdownList
              items={items}
              pivot={pivot}
              marginTop={buttonHeight}
              onItemClicked={this.onDropdownItemClicked}
              onClickOutside={this.onClickOutside}
            />
          )}
      </StyledDropdown>
    );
  }
}

export default Dropdown;
