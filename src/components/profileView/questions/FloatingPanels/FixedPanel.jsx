import React from 'react';
import styled from 'styled-components';

const GrayBackground = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.5);
`;

const BlackPanel = styled.div`
  position: fixed;
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

  &::-webkit-scrollbar {
    width: 0.8em;
  }

  &::-webkit-scrollbar-track {
    background: white;
    border: 1px solid black;
    border-radius: 1em;
    margin-right: 1em;
    /* change me to blue to match the background */
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 1em;
    background: black;
    /* -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5); */
  }
`;

const CloseBtn = styled.button`
  align-self: flex-end;
  margin-bottom: 1em;
`;

const FixedPanel = ({ onClose, children }) => (
  <GrayBackground onClick={onClose}>
    <BlackPanel>
      <CloseBtn onClick={onClose}>&#x2718;</CloseBtn>
      {children}
    </BlackPanel>
  </GrayBackground>
);

export default FixedPanel;
