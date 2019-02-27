import React, { Component } from "react";
import NotifBtn from "./NotifBtn";
import NotifDropdown from "./NotifDropdown";
import NavItem from "./NavItem";
import NotificationsGQL from "./NotificationsGQL";

const getNumOfSeen = (notifications: any[]) =>
  notifications ? notifications.filter(n => !n.seen).length : 0;

interface NotificationsProps {}
interface NotificationsState {
  showDropdown: boolean;
}

class Notifications extends Component<NotificationsProps, NotificationsState> {
  state = {
    showDropdown: false
  };

  notifBtn = React.createRef();

  onClickNotification = () => {
    this.toggleDropdown();
  };

  onClickOutsideDropdown = (e: any) => {
    const isNotifBtn = this.isTargetNotifBtn(e.target);
    if (isNotifBtn) return;
    this.toggleDropdown();
  };

  onClick = (markSeen: any) => async () => {
    this.toggleDropdown();
    await markSeen();
  };

  isTargetNotifBtn = (target: any) => {
    // TODO simplify
    const buttonWrapper = this.notifBtn.current as any;
    const btnChildren = buttonWrapper.querySelectorAll("*");

    return target === buttonWrapper || [...btnChildren].includes(target);
  };

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  render() {
    const { showDropdown } = this.state;

    return (
      <NotificationsGQL>
        {(loading, error, notifications, markSeen) => {
          const dropdownProps = {
            loading,
            error,
            notifications,
            onClickOutside: this.onClickOutsideDropdown,
            onClickNotification: this.onClickNotification
          };
          const totalUnseen = getNumOfSeen(notifications);

          return (
            <NavItem>
              <NotifBtn
                ref={this.notifBtn}
                onClick={this.onClick(markSeen)}
                totalUnseen={totalUnseen}
              />
              {showDropdown && <NotifDropdown {...dropdownProps} />}
            </NavItem>
          );
        }}
      </NotificationsGQL>
    );
  }
}

export default Notifications;
