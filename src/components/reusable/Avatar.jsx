import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-size: 20px;
  text-align: center;
  display: inline-block;
  width: ${props => props.theme.avatarSize};
  height: ${props => props.theme.avatarSize};
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid black;`;

const Img = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);`;

Wrapper.defaultProps = {
  theme: {
    avatarSize: '150px',
  },
};

const Avatar = props => (
  <Wrapper className={props.className}>
    <Img src={props.src} />
  </Wrapper>
);

export {
  Wrapper,
  Img,
};

export default styled(Avatar)``;
