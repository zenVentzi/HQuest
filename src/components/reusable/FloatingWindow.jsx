import React from 'react';
import styled from 'styled-components';
import { WindowClose } from 'styled-icons/fa-solid/WindowClose';

const BackgroundShade = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: black;
`;

const StyledWindow = styled.div`
  position: fixed;
  padding: 1em;
  display: flex;
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  top: 20%;
  left: 30%;
  width: 40%;
  height: 60%;
  background: white;
  border-radius: 0.2em;
  color: black;
  z-index: 1;
`;

const CloseBtn = styled(WindowClose).attrs({
  size: '1.4em',
})`
  cursor: pointer;
  position: sticky;
  background: black;
  align-self: flex-end;
  flex-shrink: 0;
  margin-top: -0.5em;
  margin-right: -0.5em;
  margin-bottom: 1em;
  /* margin: 1em; */
`;

const Window = ({ onClose, children }) => (
  <BackgroundShade onClick={onClose}>
    <StyledWindow>
      <CloseBtn
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
      />
      {/* <Btn>ts</Btn> */}
      {children}
    </StyledWindow>
  </BackgroundShade>
);

export default Window;
