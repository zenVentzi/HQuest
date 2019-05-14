import React from "react";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";
import IconBtn from "Reusable/IconBtn";
import Dropdown from "Reusable/Dropdown";
import { CaretDown } from "styled-icons/fa-solid/CaretDown";
// import { WindowClose as CaretDown } from "styled-icons/fa-solid/WindowClose";

interface AnswerOptionsProps {
  onClickEdit: () => void;
  // onClickRemove: () => void;
  onClickMove: () => void;
  visible: boolean;
}

const AnswerOptions = (props: AnswerOptionsProps) => {
  const onClickEdit = () => {
    props.onClickEdit();
  };
  // const onClickRemove = () => {
  //   props.onClickRemove();
  // };
  const onClickMove = () => {
    props.onClickMove();
  };

  const { visible } = props;

  const options = [
    <TextBtn key="edit" onClick={onClickEdit}>
      Edit
    </TextBtn>,
    // <TextBtn key="remove" onClick={onClickRemove}>
    //   Remove
    // </TextBtn>,
    <TextBtn key="move" onClick={onClickMove}>
      Move
    </TextBtn>
  ];

  return (
    <Dropdown
      pivot="right"
      dropBtn={
        <IconBtn
          icon={CaretDown}
          size="1em"
          visible={!!visible}
          onClick={() => {}}
          backgroundColor="black"
          color="white"
        />
      }
      items={options}
    />
  );
};

export default AnswerOptions;
