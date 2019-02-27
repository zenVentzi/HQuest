import React from "react";
import { Notifications } from "styled-icons/material/Notifications";
import styled from "styled-components";
import { clickableIcon } from "Reusable/css";

const Btn = styled.div<{ visible: boolean }>`
  display: inline-block;
  position: relative;
  padding: 2px 5px;
  ${clickableIcon};
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

interface NotifBtnProps {
  totalUnseen: number;
  onClick: any;
}

const NotifBtn = React.forwardRef<HTMLDivElement, NotifBtnProps>(
  ({ totalUnseen, onClick }: NotifBtnProps, ref) => (
    <Btn ref={ref} onClick={onClick} visible>
      <Notifications size="2em" />
      {totalUnseen > 0 && <Badge>{totalUnseen}</Badge>}
    </Btn>
  )
);

export default NotifBtn;
