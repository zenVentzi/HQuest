import React from 'react';
import { Notifications } from 'styled-icons/material/Notifications';
import styled from 'styled-components';

const Btn = styled.div`
  display: inline-block; /* Inline elements with width and height. TL;DR they make the icon buttons stack from left-to-right instead of top-to-bottom */
  position: relative;
  padding: 2px 5px; /* Add some padding so it looks nice */
`;

const Badge = styled.span`
  background-color: #fa3e3e;
  border-radius: 2px;
  color: white;

  padding: 1px 3px;
  font-size: 10px;

  position: absolute; /* Position the badge within the relatively positioned button */
  top: 0;
  right: 0;
`;

const NotifBtn = React.forwardRef(({ totalUnseen, onClick }, ref) => (
  <Btn innerRef={ref} onClick={onClick}>
    <Notifications size="2em" css="cursor: pointer" />
    {totalUnseen > 0 && <Badge>{totalUnseen}</Badge>}
  </Btn>
));

export default NotifBtn;
