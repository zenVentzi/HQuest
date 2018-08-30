import React from 'react';
import { ThumbsUp } from 'styled-icons/feather/ThumbsUp';
import { Smile } from 'styled-icons/fa-regular/Smile';
import { Smiley } from 'styled-icons/octicons/Smiley';
import { Heart } from 'styled-icons/feather/Heart';
import { HandPeace } from 'styled-icons/fa-regular/HandPeace';
import styled, { css } from 'styled-components';

// const btnCss = `cursor: pointer; margin-right: 0.7em;`;

const common = css`
  cursor: pointer;
  margin-right: 0.7em;
  color: black;
  &:hover {
    color: cyan;
  }
`;

const attrs = {
  size: `2em`,
};

const ThumbsUpBtn = styled(ThumbsUp).attrs(attrs)`
  ${common};
`;

const SmileBtn = styled(Smile).attrs(attrs)`
  ${common};
`;

const SmileyBtn = styled(Smiley).attrs(attrs)`
  ${common};
`;

const HeartBtn = styled(Heart).attrs(attrs)`
  ${common};
`;

const HandPeaceBtn = styled(HandPeace).attrs(attrs)`
  ${common};
`;

const StyledButtons = styled.div`
  width: 80%;
  padding: 0.2em;
  border-radius: 0.2em;
  margin-bottom: 1em;
  display: flex;
  min-height: min-content;
  justify-content: center;
  background: white;
`;

const ReactButtons = () => (
  <StyledButtons>
    <ThumbsUpBtn onClick={() => console.log(`click`)} />
    <SmileBtn />
    <SmileyBtn />
    <HeartBtn />
    <HandPeaceBtn />
  </StyledButtons>
);

export default ReactButtons;
