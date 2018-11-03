import React, { Fragment } from 'react';
import { Field as FormikField, ErrorMessage } from 'formik';
import styled from 'styled-components';

const StyledField = styled(FormikField)`
  margin-bottom: 0.5em;
  display: block;
`;

const Field = ({ touched, ...props }) => {
  return (
    <Fragment>
      {touched && <ErrorMessage name={props.name} component="div" />}
      <StyledField {...props} />
    </Fragment>
  );
};

export default Field;
