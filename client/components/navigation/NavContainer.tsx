// import React from 'react';
import styled from "styled-components";

const NavContainer = styled.div`
  position: fixed;
  display: flex;
  justify-content: space-between;
  top: 0;
  width: 100%;
  max-width: 100%;
  /* padding: 0.2em 5em 0em 5em; */
  background: black;
  z-index: 1;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default NavContainer;
