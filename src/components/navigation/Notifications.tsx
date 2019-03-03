import React, { useState, useRef } from "react";
import NotifBtn from "./NotifBtn";
import NotifDropdown from "./NotifDropdown";
import NavItem from "./NavItem";
import NotificationsGQL from "./NotificationsGQL";
import { MutationFn } from "react-apollo";

const getNumOfSeen = (notifications: any[]) =>
  notifications ? notifications.filter(n => !n.seen).length : 0;

interface NotificationsProps {}
const Notifications = (props: NotificationsProps) => {
  const [showDropdown, setShowDroddown] = useState(false);
  const notifBtn = useRef<HTMLDivElement>(null);
  // notifBtn = React.createRef<HTMLDivElement>();

  const onClickNotification = () => {
    toggleDropdown();
  };

  const onClickOutsideDropdown = (e: MouseEvent) => {
    const isNotifBtn = isTargetNotifBtn(e.target);
    if (isNotifBtn) return;
    toggleDropdown();
  };

  const onClick = (markSeen: MutationFn) => async () => {
    toggleDropdown();
    await markSeen();
  };

  const isTargetNotifBtn = (target: EventTarget) => {
    // TODO simplify
    const buttonWrapper = notifBtn.current;
    const btnChildren = buttonWrapper.querySelectorAll("*");

    //@ts-ignore
    return target === buttonWrapper || [...btnChildren].includes(target);
  };

  const toggleDropdown = () => {
    setShowDroddown(!showDropdown);
  };

  return (
    <NotificationsGQL>
      {(loading, error, notifications, markSeen) => {
        const dropdownProps = {
          loading,
          error,
          notifications,
          onClickOutside: onClickOutsideDropdown,
          onClickNotification: onClickNotification
        };
        const totalUnseen = getNumOfSeen(notifications);

        return (
          <NavItem>
            <NotifBtn
              ref={notifBtn}
              onClick={onClick(markSeen)}
              totalUnseen={totalUnseen}
            />
            {showDropdown && <NotifDropdown {...dropdownProps} />}
          </NavItem>
        );
      }}
    </NotificationsGQL>
  );
};

export default Notifications;
