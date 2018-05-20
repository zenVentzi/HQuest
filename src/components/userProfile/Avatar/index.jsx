import React from 'react';
import StyledAvatarWrapper from '../../.reusable/StyledAvatarWrapper';
import StyledAvatarImage from '../../.reusable/StyledAvatarImage';
import StyledAvatarUpdate from './StyledAvatarUpdate';

const UserAvatar = () => (
  <StyledAvatarWrapper>
    <StyledAvatarImage src="/" alt="" />
    <StyledAvatarUpdate />
  </StyledAvatarWrapper>
);

export default UserAvatar;
