import React, { CSSProperties, ReactElement } from "react";

interface StyledIconProps {
  icon: React.FunctionComponent<{ size: string; style: CSSProperties }>;
  visible?: boolean | 0 | 1;
  size?: string;
  style?: CSSProperties;
}

const StyledIcon = ({
  icon: Icon,
  visible = true,
  size = "2em",
  style
}: StyledIconProps) => {
  return (
    <Icon
      size={size}
      style={{
        verticalAlign: "middle",
        pointerEvents: "none",
        visibility: visible ? "inherit" : "hidden",
        ...style
      }}
    />
  );
};

export default StyledIcon;
