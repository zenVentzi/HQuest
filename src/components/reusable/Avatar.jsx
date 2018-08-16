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
  border: 2px solid black;
`;

const Img = styled.img`
  max-width: 100%;
  max-height: 100%;
  border-radius: 50%;
  /* position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); */
`;

Wrapper.defaultProps = {
  theme: {
    avatarSize: '150px',
  },
};

const Avatar = ({ children, className, src, onMouseOver, onMouseOut }) => (
  <Wrapper
    className={className}
    onMouseOver={onMouseOver}
    onMouseOut={onMouseOut}
  >
    <Img src={src} />
    {children}
  </Wrapper>
);

export { Wrapper, Img };

export default styled(Avatar)``;
