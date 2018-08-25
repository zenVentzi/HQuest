import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query, Mutation } from 'react-apollo';
import NotifBtn from './NotifBtn';
import NotifDropdown from './NotifDropdown';
import NavItem from './NavItem';

const NOTIFICATIONS = gql`
  query notifications {
    notifications {
      id
      performerId
      performerAvatarSrc
      text
      seen
      createdOn
    }
  }
`;

const NOTIFS_MARK_SEEN = gql`
  mutation notifsMarkSeen {
    notifsMarkSeen
  }
`;

const numOfUnseen = notifications =>
  notifications ? notifications.filter(n => !n.seen).length : 0;

class Notifications extends Component {
  state = {
    showDropdown: false,
  };

  onClickOutsideDropdown = e => {
    const isNotifBtn = this.isTargetNotifBtn(e.target);
    if (isNotifBtn) return;
    this.toggleDropdown();
  };

  onClick = markSeen => async () => {
    console.log(`here`);
    this.toggleDropdown();
    await markSeen();
  };

  isTargetNotifBtn = target => {
    const buttonWrapper = this.notifBtn.current;
    const btnChildren = buttonWrapper.querySelectorAll('*');

    return target === buttonWrapper || [...btnChildren].includes(target);
  };

  notifBtn = React.createRef();

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  render() {
    const { showDropdown } = this.state;

    return (
      <Query query={NOTIFICATIONS}>
        {({ loading, error, data: { notifications } }) => {
          const dropdownProps = {
            loading,
            error,
            notifications,
            onClickOutside: this.onClickOutsideDropdown,
          };
          const totalUnseen = numOfUnseen(notifications);

          return (
            <Mutation mutation={NOTIFS_MARK_SEEN}>
              {markSeen => (
                <NavItem>
                  <NotifBtn
                    ref={this.notifBtn}
                    onClick={this.onClick(markSeen)}
                    totalUnseen={totalUnseen}
                  />
                  {showDropdown && <NotifDropdown {...dropdownProps} />}
                </NavItem>
              )}
            </Mutation>
          );
        }}
      </Query>
    );
  }
}

export default Notifications;
