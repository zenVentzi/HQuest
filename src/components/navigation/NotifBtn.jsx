import React from 'react';
import { Notifications } from 'styled-icons/material/Notifications';
import styled from 'styled-components';
import { iconBtn } from 'Reusable/css';

const Btn = styled.div`
  display: inline-block;
  position: relative;
  padding: 2px 5px;
  ${iconBtn};
`;

const Badge = styled.span`
  background-color: #fa3e3e;
  border-radius: 2px;
  color: white;

  padding: 1px 3px;
  font-size: 10px;

  position: absolute;
  top: 0;
  right: 0;
`;

const NotifBtn = React.forwardRef(({ totalUnseen, onClick }, ref) => (
  <Btn innerRef={ref} onClick={onClick}>
    <Notifications size="2em" />
    {totalUnseen > 0 && <Badge>{totalUnseen}</Badge>}
  </Btn>
));

export default NotifBtn;
