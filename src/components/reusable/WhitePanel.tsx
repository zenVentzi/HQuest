import React, { ReactChild, ReactNode } from "react";
import styled from "styled-components";
import IconBtn from "Reusable/IconBtn";
import { WindowClose } from "styled-icons/fa-solid/WindowClose";
import Modal from "Reusable/Modal";

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
  /* overflow-x: hidden; */
  top: 20%;
  left: 30%;
  width: 40%;
  height: 60%;
  background: white;
  color: black;
  border-radius: 0.2em;
  z-index: 1;

  @media (max-width: 1100px) {
    top: 10%;
    left: 25%;
    width: 50%;
    height: 80%;
  }
  @media (max-width: 900px) {
    top: 10%;
    left: 22.5%;
    width: 55%;
    height: 80%;
  }
  @media (max-width: 800px) {
    top: 10%;
    left: 20%;
    width: 65%;
    height: 80%;
  }
  @media (max-width: 700px) {
    top: 10%;
    left: 10%;
    width: 80%;
    height: 80%;
  }
  @media (max-width: 600px) {
    top: 10%;
    left: 5%;
    width: 90%;
    height: 80%;
  }
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

interface PanelProps {
  onClose: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  children: ReactNode;
}

const Panel = ({ onClose, children }: PanelProps) => (
  <Modal>
    <BackgroundShade onClick={onClose}>
      <StyledPanel>
        <TopRightCorner>
          <IconBtn // FIXME it disappears on scroll
            icon={WindowClose}
            size="1.4em"
            onClick={e => {
              e.stopPropagation();
              onClose(e);
            }}
            color="black"
            backgroundColor="white"
          />
        </TopRightCorner>
        {children}
      </StyledPanel>
    </BackgroundShade>
  </Modal>
);

export default Panel;
