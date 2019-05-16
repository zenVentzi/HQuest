import React from "react";
import { toast } from "react-toastify";
import styled from "styled-components";
import TextBtn from "Reusable/TextBtn";

const StyledEditor = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  text-align: center;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  text-align: center;
  width: 35%;
  margin: 1em 0em 1em 0em;
`;

interface PositionEditorProps {
  position: number;
  maxPosition: number;
  onClickMove: (newPosition: number) => void;
  onClickClose: () => void;
}

const PositionEditor = ({
  position,
  maxPosition,
  onClickMove,
  onClickClose
}: PositionEditorProps) => {
  const inputRef = React.createRef<HTMLInputElement>();

  const onChange = () => {
    const val = parseInt(inputRef.current!.value, 10);

    if (val > maxPosition) {
      inputRef.current!.value = String(maxPosition);
    } else if (val < 1) {
      inputRef.current!.value = "1";
    }
  };

  return (
    <StyledEditor>
      <div>
        Position:{" "}
        <input
          onChange={onChange}
          ref={inputRef}
          type="number"
          defaultValue={String(position)}
          min={1}
          max={maxPosition}
        />
      </div>
      <Buttons>
        <TextBtn
          color="white"
          backgroundColor="black"
          onClick={() => {
            const newPosition = parseInt(inputRef.current!.value, 10);

            if (!newPosition) {
              toast.error(`Value should be between 1 and ${maxPosition}`);
              return;
            }

            onClickMove(newPosition);
          }}
        >
          Move
        </TextBtn>
        <TextBtn onClick={onClickClose} color="white" backgroundColor="black">
          Cancel
        </TextBtn>
      </Buttons>
    </StyledEditor>
  );
};

export default PositionEditor;
