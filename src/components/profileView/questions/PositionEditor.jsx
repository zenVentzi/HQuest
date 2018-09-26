import React, { Fragment, Component } from 'react';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

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
      <div>
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
        <TextBtn onClick={onClickClose}>Close</TextBtn>
      </div>
    </div>
  );
};

export default PositionEditor;
