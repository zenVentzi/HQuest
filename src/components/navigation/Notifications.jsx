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

  onClick = markSeen => async () => {
    this.toggleDropdown();
    await markSeen();
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
            <Mutation mutation={NOTIFS_MARK_SEEN}>
              {markSeen => (
                <NavItem>
                  <NotifBtn
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
