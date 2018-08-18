import React, { Fragment } from 'react';
import styled from 'styled-components';

const Value = styled.input`
  margin-bottom: 1em;
  width: 90%;
`;

const SEPARATOR = `*2nd*`;

const WouldYouBody = props => {
  const value1 = React.createRef();
  const value2 = React.createRef();

  const onChange = () => {
    const val1 = value1.current.value.trim();
    const val2 = value2.current.value.trim();

    const question = `${val1}${SEPARATOR}${val2}`;
    props.onChange({ question });
  };

  return (
    <Fragment>
      <Value placeholder="would you.." innerRef={value1} onChange={onChange} />
      <Value placeholder="but.." innerRef={value2} onChange={onChange} />
    </Fragment>
  );
};

export default WouldYouBody;
