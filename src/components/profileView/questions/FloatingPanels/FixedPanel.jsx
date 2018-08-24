import React from 'react';
import styled from 'styled-components';
import { WindowClose } from 'styled-icons/fa-solid/WindowClose';

const GrayBackground = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
`;

const BlackPanel = styled.div`
  position: fixed;
  padding: 0.5em;
  display: flex;
  flex: 1;
  overflow-y: auto;
  flex-direction: column;
  align-items: center;
  top: 20%;
  left: 30%;
  width: 40%;
  height: 60%;
  background: black;
  border-radius: 0.2em;
  color: white;
`;

const CloseBtn = styled(WindowClose).attrs({
  size: '1.4em',
})`
  cursor: pointer;
  color: white;
  align-self: flex-end;
  flex-shrink: 0;
  margin-bottom: 1em;
  /* margin: 1em; */
`;

const FixedPanel = ({ onClose, children }) => (
  <GrayBackground onClick={onClose}>
    <BlackPanel>
      <CloseBtn
        onClick={e => {
          e.stopPropagation();
          onClose();
        }}
      />
      {/* <Btn>ts</Btn> */}
      {children}
    </BlackPanel>
  </GrayBackground>
);

export default FixedPanel;
