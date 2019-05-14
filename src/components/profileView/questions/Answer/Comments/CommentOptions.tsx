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
//     props.onClickOutside(e);
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

import React from "react";
import TextBtn from "Reusable/TextBtn";
import IconBtn from "Reusable/IconBtn";
import Dropdown from "Reusable/Dropdown";
import { CaretDown } from "styled-icons/fa-solid/CaretDown";

interface CommentOptionsProps {
  onClickEdit: () => void;
  onClickRemove: () => void;
  visible: boolean;
}

const CommentOptions = (props: CommentOptionsProps) => {
  const onClickEdit = () => {
    props.onClickEdit();
  };
  const onClickRemove = () => {
    props.onClickRemove();
  };

  const { visible } = props;

  const options = [
    <TextBtn key="edit" onClick={onClickEdit}>
      Edit
    </TextBtn>,
    <TextBtn key="remove" onClick={onClickRemove}>
      Remove
    </TextBtn>
  ];

  return (
    <Dropdown
      pivot="right"
      dropBtn={
        <IconBtn
          color="black"
          backgroundColor="white"
          icon={CaretDown}
          size="0.8em"
          visible={visible}
          onClick={() => {}}
        />
      }
      items={options}
    />
  );
};

export default CommentOptions;
