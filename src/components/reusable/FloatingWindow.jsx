import React from 'react';
import styled from 'styled-components';
import IconBtn from 'Reusable/IconBtn';
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

const TopRightCorner = styled.span`
  cursor: pointer;
  position: sticky;
  align-self: flex-end;
  flex-shrink: 0;
  margin-top: -0.5em;
  margin-right: -0.5em;
  margin-bottom: 1em;
`;

const Window = ({ onClose, children }) => (
  <BackgroundShade onClick={onClose}>
    <StyledWindow>
      {/* <CloseBtn size="1.4em" /> */}
      <TopRightCorner>
        <IconBtn
          icon={WindowClose}
          size="1.4em"
          onClick={e => {
            e.stopPropagation();
            onClose();
          }}
        />
      </TopRightCorner>
      {children}
    </StyledWindow>
  </BackgroundShade>
);

export default Window;
