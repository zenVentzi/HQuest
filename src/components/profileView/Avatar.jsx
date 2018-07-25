import React, { Component, Fragment } from 'react';
import styled from 'styled-components';
import FloatingEditor from './FloatingEditor';

const Wrapper = styled.div`
  position: relative;
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
  position: relative;
  top: 50%;
  left: 50%;
  width: 100%;
  transform: translate(-50%, -50%);
`;

Wrapper.defaultProps = {
  theme: {
    avatarSize: '150px',
  },
};

const UpdateOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
    src: this.props.src,
    inputImg: null,
    fileInputKey: 0,
  };

  onMouseOver = () => {
    this.setState(prevState => ({ ...prevState, hovered: true }));
  };

  onMouseOut = () => {
    this.setState(prevState => ({ ...prevState, hovered: false }));
  };

  onClick = () => {
    this.upload.click();
  };

  onCloseEditor = src => {
    const newState = { ...this.state };

    if (src) {
      newState.src = `${src}?time=${new Date().valueOf()}`;
    }

    newState.inputImg = null;
    newState.fileInputKey = this.state.fileInputKey + 1;
    this.setState(newState);
  };

  onChangeFile = event => {
    event.stopPropagation();
    event.preventDefault();

    const incorrectType = event.target.files[0].type.indexOf('image') === -1;

    if (incorrectType) {
      // do sth
      return;
    }

    const newState = { ...this.state };
    [newState.inputImg] = event.target.files;

    this.setState(newState);
  };

  render() {
    // return <div> fdf </div>;
    const { src, fileInputKey } = this.state;

    return (
      <Fragment>
        <Wrapper
          onMouseOver={this.onMouseOver}
          onFocus={this.onMouseOver}
          onMouseOut={this.onMouseOut}
          onBlur={this.onMouseOut}
          onClick={this.onClick}
        >
          <Img src={src} />
          {this.state.hovered && <UpdateOverlay>Upload </UpdateOverlay>}
        </Wrapper>
        {this.state.inputImg && (
          <FloatingEditor
            image={this.state.inputImg}
            onCloseEditor={this.onCloseEditor}
          />
        )}
        <input
          id="myInput"
          key={fileInputKey}
          type="file"
          accept="image/*"
          ref={ref => {
            this.upload = ref;
          }}
          style={{ display: 'none' }}
          onChange={this.onChangeFile}
        />
      </Fragment>
    );
  }
}

export default Avatar;
