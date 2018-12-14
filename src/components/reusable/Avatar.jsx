import React, { Component, Fragment } from 'react';
import Img from 'react-image';
import styled from 'styled-components';
import Editor from './AvatarEditor';

const Wrapper = styled.div`
  position: relative;
  font-size: 20px;
  text-align: center;
  display: inline-block;
  width: ${props => props.theme.avatarSize};
  height: ${props => props.theme.avatarSize};
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid ${props => props.theme.foregroundColor};

  &:hover {
    cursor: ${props => (props.editable ? 'pointer' : 'inherit')};
  }
`;

const StyledImg = styled(Img)`
  max-width: 100%;
  max-height: 100%;
  /* border-radius: 50%; */
`;

const UpdateOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  display: inline-block;
  width: 100%;
  height: 100%;
  background-color: black;

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
    if (!this.props.editable) return;
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
    const { editable, className, invertColors } = this.props;
    const { src, fileInputKey } = this.state;

    return (
      <Fragment>
        {this.state.inputImg ? (
          <Editor
            image={this.state.inputImg}
            onCloseEditor={this.onCloseEditor}
          />
        ) : (
          <Wrapper
            className={className}
            invertColors={invertColors}
            editable={editable}
            onMouseOver={this.onMouseOver}
            onFocus={this.onMouseOver}
            onMouseOut={this.onMouseOut}
            onBlur={this.onMouseOut}
            onClick={this.onClick}
          >
            <StyledImg src={src} />
            {editable &&
              this.state.hovered && <UpdateOverlay>Upload</UpdateOverlay>}
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
          </Wrapper>
        )}
      </Fragment>
    );
  }
}

// export { Wrapper, Img };

// export default styled(Avatar)``;

export default Avatar;
