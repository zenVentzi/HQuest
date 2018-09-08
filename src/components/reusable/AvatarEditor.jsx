import React, { Component } from 'react';
import styled from 'styled-components';
import Editor from 'react-avatar-editor';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import Btn from './Btn';

const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($base64Img: String!) {
    uploadAvatar(base64Img: $base64Img)
  }
`;

const Wrapper = styled.div`
  position: fixed;
  z-index: 1;
  top: 30px;
  padding: 3px 3px 3px 3px;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
`;

class AvatarEditor extends Component {
  onClickSave = uploadAvatar => async () => {
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas();
      const base64Img = canvasScaled.toDataURL('image/jpeg').split(',')[1];
      const variables = { base64Img };
      // show loading/uploading
      const { data } = await uploadAvatar({ variables });
      const src = data.uploadAvatar;

      this.props.onCloseEditor(src);
    }
  };

  onClickCancel = () => {
    this.props.onCloseEditor();
  };

  setEditorRef = editor => {
    this.editor = editor;
  };

  render() {
    return (
      <Mutation mutation={UPLOAD_AVATAR}>
        {uploadAvatar => {
          const { image } = this.props;

          return (
            <Wrapper>
              <Editor
                ref={this.setEditorRef}
                image={image}
                width={150}
                height={150}
                border={50}
                scale={1.2}
                borderRadius={150}
                color={[1, 1, 1, 1]}
              />
              <div>Drag to adjust</div>
              <div>
                <Btn onClick={this.onClickSave(uploadAvatar)}>Save</Btn>
                <Btn onClick={this.onClickCancel}>Cancel</Btn>
              </div>
            </Wrapper>
          );
        }}
      </Mutation>
    );
  }
}

export default AvatarEditor;
