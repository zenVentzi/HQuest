import React, { Component } from 'react';
import { HandHoldingHeart as LikeIcon } from 'styled-icons/fa-solid/HandHoldingHeart';
import IconBtn from 'Reusable/IconBtn';
import StyledIcon from 'Reusable/StyledIcon';

/* 

*/

class LikeBtn extends Component {
  onClick = () => {
    /* how do we display the number of likes and personal likes?
    
    like in medium? */
    this.props.onClick();
  };
  render() {
    // return <button>btn</button>;
    // return <LikeIcon size="1em" />;
    // return <StyledIcon icon={LikeIcon} size="1em" />;
    return <IconBtn icon={LikeIcon} size="1.2em" onClick={this.onClick} />;
  }
}

export default LikeBtn;
