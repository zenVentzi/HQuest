import React, { Fragment, Component } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

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

const PositionEditor = ({
  position,
  maxPosition,
  onClickMove,
  onClickClose,
}) => {
  const inputRef = React.createRef();

  const onChange = () => {
    const val = parseInt(inputRef.current.value, 10);

    if (val > maxPosition) {
      inputRef.current.value = maxPosition;
    } else if (val < 1) {
      inputRef.current.value = 1;
    }
  };

  return (
    <StyledEditor>
      <div>
        Position:{' '}
        <input
          onChange={onChange}
          ref={inputRef}
          type="number"
          defaultValue={position}
          min={1}
          max={maxPosition}
        />
      </div>
      <Buttons>
        <TextBtn
          onClick={() => {
            const newPosition = parseInt(inputRef.current.value, 10);

            if (!newPosition) {
              toast.error(`Value should be between 1 and ${maxPosition}`);
              return;
            }

            onClickMove({ newPosition });
          }}
        >
          Move
        </TextBtn>
        <TextBtn onClick={onClickClose}>Cancel</TextBtn>
      </Buttons>
    </StyledEditor>
  );
};

export default PositionEditor;
