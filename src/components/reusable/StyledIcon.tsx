import React, { CSSProperties, ReactElement } from "react";

interface StyledIconProps {
  icon: React.FunctionComponent<{ size: string; style: CSSProperties }>;
  visible?: boolean;
  size?: string;
}

const StyledIcon = ({
  icon: Icon,
  visible = true,
  size = "2em"
}: StyledIconProps) => {
  const style: CSSProperties = {
    verticalAlign: "middle",
    pointerEvents: "none",
    visibility: visible ? "inherit" : "hidden"
  };

  return <Icon size={size} style={style} />;
};

export default StyledIcon;
