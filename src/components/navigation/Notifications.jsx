import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
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

// const MARK_SEEN_NOTIF = gql`
//   mutation`

const numOfUnseen = notifications =>
  notifications ? notifications.filter(n => !n.seen).length : 0;

class Notifications extends Component {
  state = {
    showDropdown: false,
  };

  onClick = () => {
    // mark unseen ones as seen
    this.toggleDropdown();
  };

  toggleDropdown = () => {
    const current = this.state.showDropdown;
    this.setState({ showDropdown: !current });
  };

  render() {
    const { showDropdown } = this.state;

    return (
      <Query query={NOTIFICATIONS}>
        {({ loading, error, data: { notifications } }) => {
          const dropdownProps = { loading, error, notifications };
          const totalUnseen = numOfUnseen(notifications);

          return (
            <NavItem>
              <NotifBtn onClick={this.onClick} totalUnseen={totalUnseen} />
              {showDropdown && <NotifDropdown {...dropdownProps} />}
            </NavItem>
          );
        }}
      </Query>
    );
  }
}

export default Notifications;
