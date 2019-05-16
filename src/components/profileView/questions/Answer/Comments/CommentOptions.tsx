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
    <TextBtn
      color="black"
      backgroundColor="white"
      key="edit"
      onClick={onClickEdit}
    >
      Edit
    </TextBtn>,
    <TextBtn
      color="black"
      backgroundColor="white"
      key="remove"
      onClick={onClickRemove}
    >
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
