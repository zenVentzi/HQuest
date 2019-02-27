import React from "react";

interface StyledIconProps {
  icon: any;
  visible?: boolean;
  size?: string;
}

const StyledIcon = ({
  icon: Icon,
  visible = true,
  size = "2em"
}: StyledIconProps) => {
  const style = {
    verticalAlign: "middle",
    pointerEvents: "none",
    visibility: visible ? "inherit" : "hidden"
  };

  return <Icon size={size} style={style} />;
};

export default StyledIcon;
