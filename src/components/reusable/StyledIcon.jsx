import React from 'react';

const StyledIcon = ({ icon: Icon, innerRef }) => {
  return <Icon innerRef={innerRef} size="2em" css="vertical-align: middle;" />;
};

export default StyledIcon;
