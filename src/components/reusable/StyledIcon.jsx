import React from 'react';

const StyledIcon = ({ icon: Icon, visible = true, size = '2em' }) => {
  const style = {
    verticalAlign: 'middle',
    pointerEvents: 'none',
    visibility: visible ? 'visible' : 'hidden',
  };

  return <Icon size={size} style={style} />;
};

export default StyledIcon;
