import React, { CSSProperties } from "react";
import styled from "styled-components";
import StyledIcon from "Reusable/StyledIcon";
import { clickableIcon, ClickableIconProps } from "Reusable/css";

const StyledBtn = styled.div`
  ${clickableIcon};
`;

StyledBtn.defaultProps = {};

type BtnProps = ClickableIconProps & {
  icon: any;
  size: string;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  // iconStyle?: CSSProperties;
};

const Btn = React.forwardRef<HTMLDivElement, BtnProps>(
  ({ icon, size, onClick, visible = true, color, backgroundColor }, ref) => {
    return (
      <StyledBtn
        role="button"
        ref={ref}
        onClick={onClick}
        color={color}
        backgroundColor={backgroundColor}
        visible={visible}
      >
        <StyledIcon size={size} icon={icon} visible={visible} />
      </StyledBtn>
    );
  }
);

export default Btn;
