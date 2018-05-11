import React from 'react';
import styled from 'styled-components';

const StyledUserName = styled.div`
  padding: initial;
  font-size: 20px;
  text-align: center;`;

const UserName = () => (
  <StyledUserName>
      Ventsislav Marinov
  </StyledUserName>
);

export default UserName;
