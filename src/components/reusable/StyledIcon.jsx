import React from 'react';

const StyledIcon = ({ icon: Icon, hide, size = '2em' }) => {
  const style = {
    verticalAlign: 'middle',
    pointerEvents: 'none',
    visibility: hide ? 'hidden' : 'visible',
  };

  return <Icon size={size} style={style} />;
};

export default StyledIcon;
