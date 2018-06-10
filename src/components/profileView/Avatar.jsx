import React from 'react';
import styled from 'styled-components';
import DefaultAvatar from '../reusable/Avatar';

const UpdateOverlay = styled.div`
  pointer-events: none;
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.50)
  
  color: white;
  line-height: 150px;`;

const Avatar = () => (
  <DefaultAvatar>
    {/* <UpdateOverlay /> */}
  </DefaultAvatar>
);

export default Avatar;
