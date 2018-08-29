import React from 'react';

const Icon = ({ children }) => {
  if (React.Children.count(children) !== 1) {
    throw new Error(`Btn should have exactly 1 child`);
  }

  const child = React.Children.toArray(children)[0];

  if (typeof child === 'string') {
    throw new Error('Icon child cannot be string');
  }

  const res = {
    ...child,
    props: { size: '2em', css: 'vertical-align: middle;' },
  };

  return res;
};

export default Icon;
