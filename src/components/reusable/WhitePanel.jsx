import React from 'react';
import styled from 'styled-components';
import IconBtn from 'Reusable/IconBtn';
import { WindowClose } from 'styled-icons/fa-solid/WindowClose';
import Modal from 'Reusable/Modal';

const BackgroundShade = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  width: 100%;
  height: 100%;
  background: black;
`;

const StyledPanel = styled.div`
  position: fixed;
  padding: 1em;
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;
  top: 20%;
  left: 30%;
  width: 40%;
  height: 60%;
  background: white;
  color: black;
  border-radius: 0.2em;
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

const Panel = ({ onClose, children }) => (
  <Modal>
    <BackgroundShade onClick={onClose}>
      <StyledPanel>
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
      </StyledPanel>
    </BackgroundShade>
  </Modal>
);

export default Panel;
