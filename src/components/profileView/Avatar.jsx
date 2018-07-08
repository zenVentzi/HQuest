import React, { Component } from 'react';
import gql from 'graphql-tag';
import styled from 'styled-components';
import DefaultAvatar from '../reusable/Avatar';
import { Mutation } from 'react-apollo';

// const UPLOAD_AVATAR = gql`
//   mutation uploadAvatar($upload: Upload!) {
//     uploadAvatar(upload: $upload)
//   }
// `;

const Wrapper = styled.div`
  font-size: 20px;
  text-align: center;
  display: inline-block;
  width: ${props => props.theme.avatarSize};
  height: ${props => props.theme.avatarSize};
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid black;

  &:hover {
    cursor: pointer;
  }
`;

const Img = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

Wrapper.defaultProps = {
  theme: {
    avatarSize: '150px',
  },
};

const UpdateOverlay = styled.div`
  pointer-events: none;
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.1);

  color: white;
  line-height: 150px;
`;

class Avatar extends Component {
  state = {
    hovered: false,
  };

  onMouseOver = () => {
    this.setState(prevState => ({ ...prevState, hovered: true }));
  };

  onMouseOut = () => {
    this.setState(prevState => ({ ...prevState, hovered: false }));
  };

  onClick = () => {
    // this.setState(prevState => ({ ...prevState, clicked: true }));
    this.upload.click();
  };

  onChangeFile = uploadAvatar => event => {
    event.stopPropagation();
    event.preventDefault();
    const file = event.target.files[0];
    console.log(file);
    const variables = { upload: file };
    uploadAvatar({ variables });
    // this.setState({ file }); // / if you want to upload latter
  };

  render() {
    return <div />;
    const { src } = this.props;
    return (
      <Mutation mutation={UPLOAD_AVATAR}>
        {(uploadAvatar, { data }) => {
          const t = 5;

          return (
            <Wrapper
              onMouseOver={this.onMouseOver}
              onFocus={this.onMouseOver}
              onMouseOut={this.onMouseOut}
              onBlur={this.onMouseOut}
              onClick={this.onClick}
            >
              <Img src={src} />
              {this.state.hovered && <UpdateOverlay>Upload </UpdateOverlay>}
              <input
                id="myInput"
                type="file"
                ref={ref => {
                  this.upload = ref;
                }}
                style={{ display: 'none' }}
                onChange={this.onChangeFile(uploadAvatar)}
              />
            </Wrapper>
          );
        }}
      </Mutation>
    );
  }
}

export default Avatar;
