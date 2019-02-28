import React, { Component } from "react";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";
import IconBtn from "Reusable/IconBtn";
import Dropdown from "Reusable/Dropdown";
import { CaretDown } from "styled-icons/fa-solid";

interface AnswerOptionsProps {
  onClickEdit: any;
  onClickRemove: any;
  onClickMove: any;
  visible: boolean;
}

class AnswerOptions extends Component<AnswerOptionsProps, any> {
  onClickEdit = () => {
    this.props.onClickEdit();
  };
  onClickRemove = () => {
    this.props.onClickRemove();
  };
  onClickMove = () => {
    this.props.onClickMove();
  };

  render() {
    const { visible } = this.props;

    const options = [
      <TextBtn key="edit" onClick={this.onClickEdit}>
        Edit
      </TextBtn>,
      <TextBtn key="remove" onClick={this.onClickRemove}>
        Remove
      </TextBtn>,
      <TextBtn key="move" onClick={this.onClickMove}>
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
          />
        }
        items={options}
      />
    );
  }
}

export default AnswerOptions;
