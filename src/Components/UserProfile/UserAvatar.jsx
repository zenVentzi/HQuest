import React from 'react';
import style from './css/avatar.css';

const UserAvatar = () => (
  <div className="grid-item">
    <div className="avatar-container">
      <img src="/" className="avatar" alt="" />
      <div className="update-avatar">
        <a href="/">Update</a>
      </div>
    </div>
  </div>
);

export default UserAvatar;
