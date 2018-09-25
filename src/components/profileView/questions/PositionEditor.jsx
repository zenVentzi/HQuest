import React, { Fragment, Component } from 'react';
import styled from 'styled-components';
import TextBtn from 'Reusable/TextBtn';

const PositionEditor = ({ position, onClickMove, onClickClose }) => {
  const inputRef = React.createRef();

  return (
    <div>
      Position:{' '}
      <input
        ref={inputRef}
        type="number"
        defaultValue={position}
        min={1} /* max to be implemented */
      />
      <div>
        <TextBtn
          onClick={() => {
            const newPosition = inputRef.current.value;
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
