import React from 'react';
import styled from 'styled-components';
import AvatarImage from './StyledAvatarImage';

const StyledAvatarWrapper = styled.div`
  font-size: 20px;
  text-align: center;
  
  width: ${props => props.theme.avatarSize};
  height: ${props => props.theme.avatarSize};
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid black;`;

StyledAvatarWrapper.defaultProps = {
  theme: {
    avatarSize: '150px'
  }
}
  

export default StyledAvatarWrapper;
