import React from 'react';

const StyledIcon = ({
  isBtn,
  icon: Icon,
  hide,
  size = '2em',
  innerRef,
  onClick,
}) => {
  const style = {
    verticalAlign: 'middle',
    visibility: hide ? 'hidden' : 'visible',
  };

  return (
    <Icon innerRef={innerRef} onClick={onClick} size={size} style={style} />
  );
};

export default StyledIcon;
