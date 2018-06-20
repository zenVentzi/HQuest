import React from 'react';
import styled, { keyframes } from 'styled-components';

const IN = `fadein`;
const OUT = `fadeOut`;

export { IN, OUT };

const fadeIn = keyframes`
   0% { opacity: 0; }
   100% { opacity: 1; }`;

const fadeOut = keyframes`
   0% { opacity: 1; }
   100% { opacity: 0; }`;

const StyledAnimator = styled.div`
  opacity: 0;
  animation: ${props => props.animation} 0.4s forwards;
  width: 100%;
`;

export const Animator = ({ action, children, onFadeIn, onFadedOut }) => {
  const anim = action === IN ? fadeIn : fadeOut;

  return (
    <StyledAnimator
      animation={anim}
      onAnimationStart={() => {
        if (action === IN) {
          onFadeIn();
        }
      }}
      onAnimationEnd={() => {
        if (action === OUT) {
          onFadedOut();
        }
      }}
    >
      {children}
    </StyledAnimator>
  );
};
