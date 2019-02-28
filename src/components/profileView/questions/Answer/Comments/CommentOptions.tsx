// import React, { Component } from 'react';
// import styled from 'styled-components';
// import onClickOutside from 'react-onclickoutside';

// const StyledOptions = styled.div`
//   background: white;
//   color: black;
//   /* height: 5em; */
//   /* width: 4em; */
//   top: 2em;
//   z-index: 1;
//   right: 0;
//   padding: 0.1em;
//   border-radius: 0.2em;
//   /* align-items: stretch; */
//   display: flex;
//   position: absolute;
//   flex-direction: column;
//   justify-content: space-evenly;
// `;

// const Option = styled.button`
//   margin: 0.1em;
// `;

// class CommentOptions extends Component {
//   handleClickOutside = e => {
//     this.props.onClickOutside(e);
//   };

//   render() {
//     return (
//       <StyledOptions>
//         <Option>Edit</Option>
//         <Option>Remove</Option>
//       </StyledOptions>
//     );
//   }
// }

// export default onClickOutside(CommentOptions);

import React, { Component } from "react";
import TextBtn from "Reusable/TextBtn";
import IconBtn from "Reusable/IconBtn";
import Dropdown from "Reusable/Dropdown";
import { CaretDown } from "styled-icons/fa-solid";

interface CommentOptionsProps {
  onClickEdit: () => void;
  onClickRemove: () => void;
  visible: boolean;
}

class CommentOptions extends Component<CommentOptionsProps, any> {
  onClickEdit = () => {
    this.props.onClickEdit();
  };
  onClickRemove = () => {
    this.props.onClickRemove();
  };

  render() {
    const { visible } = this.props;

    const options = [
      <TextBtn key="edit" onClick={this.onClickEdit}>
        Edit
      </TextBtn>,
      <TextBtn key="remove" onClick={this.onClickRemove}>
        Remove
      </TextBtn>
    ];

    return (
      <Dropdown
        pivot="right"
        dropBtn={
          <IconBtn
            icon={CaretDown}
            size="0.8em"
            visible={visible}
            onClick={() => {}}
          />
        }
        items={options}
      />
    );
  }
}

export default CommentOptions;
