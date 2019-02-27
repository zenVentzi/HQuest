import React, { Component } from "react";
import styled from "styled-components";
import Editor from "react-avatar-editor";
import gql from "graphql-tag";
import { Mutation, MutationFn } from "react-apollo";
import TextBtn from "Reusable/TextBtn";

const UPLOAD_AVATAR = gql`
  mutation uploadAvatar($base64Img: String!) {
    uploadAvatar(base64Img: $base64Img)
  }
`;

const Wrapper = styled.div`
  ${"" /* position: fixed; */} z-index: 1;
  ${"" /* top: 30px; */} padding: 3px 3px 3px 3px;
  background-color: white;
  border: 1px solid black;
  border-radius: 8px;
  text-align: center;
`;

const Hint = styled.div`
  color: black;
`;

interface AvatarEditorProps {
  image: string | File;
  onCloseEditor: (src?: string) => void; // split that into onSave and onClose
}

class AvatarEditor extends Component<AvatarEditorProps> {
  private editor: Editor;
  onClickSave = (uploadAvatar: MutationFn) => async () => {
    if (this.editor) {
      const canvasScaled = this.editor.getImageScaledToCanvas();
      const base64Img = canvasScaled.toDataURL("image/jpeg").split(",")[1];
      const variables = { base64Img };
      // show loading/uploading
      const res = await uploadAvatar({ variables });
      if (!res) {
        throw Error("Upload avatar mutation failed");
      }

      const src = res.data.uploadAvatar;

      this.props.onCloseEditor(src);
    }
  };

  onClickCancel = () => {
    this.props.onCloseEditor();
  };

  render() {
    return (
      <Mutation mutation={UPLOAD_AVATAR}>
        {uploadAvatar => {
          const { image } = this.props;

          return (
            <Wrapper>
              <Editor
                ref={editor => {
                  this.editor = editor;
                }}
                image={image}
                width={150}
                height={150}
                border={50}
                scale={1.2}
                borderRadius={150}
                color={[1, 1, 1, 1]}
              />
              <Hint>Drag to adjust</Hint>
              <div>
                <TextBtn onClick={this.onClickSave(uploadAvatar)}>Save</TextBtn>
                <TextBtn onClick={this.onClickCancel}>Cancel</TextBtn>
              </div>
            </Wrapper>
          );
        }}
      </Mutation>
    );
  }
}

export default AvatarEditor;
