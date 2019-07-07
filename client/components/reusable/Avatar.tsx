import React, { useRef, useState } from "react";
import Img from "react-image";
import styled from "styled-components";
import Editor from "./AvatarEditor";

interface WrapperProps {
  editable: boolean;
  theme: "bad typings support so.. have fun";
  invertColors: boolean;
  borderColor: "black" | "white";
  size: string;
}

const Wrapper = styled.div<WrapperProps>`
  position: relative;
  font-size: 20px;
  text-align: center;
  flex-shrink: 0;
  display: inline-block;
  width: ${props => props.size};
  height: ${props => props.size};
  overflow: hidden;
  border-radius: 50%;
  border: 2px solid ${props => props.borderColor};

  &:hover {
    cursor: ${props => (props.editable ? "pointer" : "inherit")};
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

interface AvatarProps {
  src: string | null | undefined;
  size: string;
  borderColor: "black" | "white";
  editable?: boolean;
  className?: string;
  invertColors?: boolean;
}

const Avatar = (props: AvatarProps) => {
  const upload = useRef<HTMLInputElement>(null);
  const [hovered, setHovered] = useState(false);
  const [src, setSrc] = useState(props.src);
  const [inputImg, setInputImg] = useState<File>();
  const [fileInputKey, setFileInputKey] = useState(0);

  const onMouseOver = () => {
    setHovered(true);
  };

  const onMouseOut = () => {
    setHovered(false);
  };

  const onClick = () => {
    if (!props.editable) return;
    upload.current!.click();
  };

  const onCloseEditor = (src?: string) => {
    if (src) {
      setSrc(`${src}?time=${new Date().valueOf()}`);
    }
    setInputImg(undefined);
    setFileInputKey(fileInputKey + 1);
  };

  const onChangeFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const incorrectType = event.target.files![0].type.indexOf("image") === -1;

    if (incorrectType) {
      // do sth
      return;
    }

    setInputImg(event.target.files![0]);
  };

  const { editable, className, invertColors } = props;

  return (
    <>
      {inputImg ? (
        <Editor image={inputImg} onClose={onCloseEditor} />
      ) : (
        <Wrapper
          className={className}
          invertColors={!!invertColors}
          editable={!!editable}
          onMouseOver={onMouseOver}
          onFocus={onMouseOver}
          onMouseOut={onMouseOut}
          onBlur={onMouseOut}
          onClick={onClick}
          borderColor={props.borderColor}
          size={props.size}
        >
          <StyledImg src={src} />
          {editable && !src && <UpdateOverlay>Upload</UpdateOverlay>}
          <input
            id="myInput"
            key={fileInputKey}
            type="file"
            accept="image/*"
            ref={upload}
            style={{ display: "none" }}
            onChange={onChangeFile}
          />
        </Wrapper>
      )}
    </>
  );
};

export default Avatar;
