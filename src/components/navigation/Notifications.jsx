import React, { Component } from 'react';
import NotifBtn from './NotifBtn';
import NotifDropdown from './NotifDropdown';
import NavItem from './NavItem';
import NotificationsGQL from './NotificationsGQL';

const numOfUnseen = notifications =>
  notifications ? notifications.filter(n => !n.seen).length : 0;

class Notifications extends Component {
  state = {
    showDropdown: false,
  };

  subscribed = false;
  notifBtn = React.createRef();

  onClickNotification = () => {
    this.toggleDropdown();
  };

  onClickOutsideDropdown = e => {
    const isNotifBtn = this.isTargetNotifBtn(e.target);
    if (isNotifBtn) return;
    this.toggleDropdown();
  };

  onClick = markSeen => async () => {
    this.toggleDropdown();
    await markSeen();
  };

  isTargetNotifBtn = target => {
    // TODO simplify
    const buttonWrapper = this.notifBtn.current;
    const btnChildren = buttonWrapper.querySelectorAll('*');

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
            onClickNotification: this.onClickNotification,
          };
          const totalUnseen = numOfUnseen(notifications);

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
