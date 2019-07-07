import React, { CSSProperties, HTMLAttributes } from "react";
import styled from "styled-components";
import StyledIcon from "Reusable/StyledIcon";
import { clickableIcon, ClickableIconProps } from "Reusable/css";

// const StyledBtn = styled.div`
//   ${clickableIcon};
// `;

// const StyledBtn = styled(
//   ({
//     color,
//     backgroundColor,
//     children,
//     ...rest
//   }: ClickableIconProps & {
//     children: any;
//     ref: React.Ref<HTMLDivElement>;
//   } & HTMLAttributes<HTMLDivElement>) => <div {...rest}>{children}</div>
// )`
//   ${clickableIcon}
// `;

const StyledBtn = styled(
  React.forwardRef<
    HTMLDivElement,
    ClickableIconProps & HTMLAttributes<HTMLDivElement>
  >(({ color, backgroundColor, visible, children, ...rest }, ref) => (
    <div ref={ref} {...rest}>
      {children}
    </div>
  ))
)`
  ${clickableIcon}
`;

// StyledBtn.defaultProps = {};

type BtnProps = HTMLAttributes<HTMLDivElement> &
  ClickableIconProps & {
    icon: any;
    size: string;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    // iconStyle?: CSSProperties;
  };

const Btn = React.forwardRef<HTMLDivElement, BtnProps>(
  (
    { icon, size, onClick, visible = true, color, backgroundColor, style },
    ref
  ) => {
    return (
      <StyledBtn
        role="button"
        ref={ref}
        onClick={onClick}
        visible={visible}
        color={color}
        backgroundColor={backgroundColor}
        style={style}
      >
        <StyledIcon size={size} icon={icon} visible={visible} />
      </StyledBtn>
    );
  }
);

export default Btn;
