import React, { useRef } from "react";
import styled from "styled-components";
import Editor from "react-avatar-editor";
import { Mutation, MutationFn } from "react-apollo";
import TextBtn from "Reusable/TextBtn";
import { UPLOAD_AVATAR } from "GqlClient/user/mutations";
import {
  UploadAvatarMutation,
  UploadAvatarVariables
} from "GqlClient/autoGenTypes";

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
  onClickCancel: (src?: string) => void; // split that into onSave and onClose
}

const AvatarEditor = (props: AvatarEditorProps) => {
  const editor = useRef<Editor>();
  const onClickSave = (
    uploadAvatar: MutationFn<UploadAvatarMutation, UploadAvatarVariables>
  ) => async () => {
    if (editor) {
      const canvasScaled = editor.current!.getImageScaledToCanvas();
      const base64Img = canvasScaled.toDataURL("image/jpeg").split(",")[1];
      const variables = { base64Img };
      // show loading/uploading
      const res = await uploadAvatar({ variables });
      if (!res) {
        throw Error("Upload avatar mutation failed");
      }

      const src = res.data!.uploadAvatar;

      props.onClickCancel(src);
    }
  };

  const onClickCancel = () => {
    props.onClickCancel();
  };

  return (
    <Mutation<UploadAvatarMutation, UploadAvatarVariables>
      mutation={UPLOAD_AVATAR}
    >
      {uploadAvatar => {
        const { image } = props;

        return (
          <Wrapper>
            <Editor
              ref={editor => {
                editor = editor;
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
              <TextBtn onClick={onClickSave(uploadAvatar)}>Save</TextBtn>
              <TextBtn onClick={onClickCancel}>Cancel</TextBtn>
            </div>
          </Wrapper>
        );
      }}
    </Mutation>
  );
};

export default AvatarEditor;
