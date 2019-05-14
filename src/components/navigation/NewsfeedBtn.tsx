import React from "react";
import IconLink from "Reusable/IconLink";
import { Home } from "styled-icons/material/Home";

const NewsfeedBtn = () => {
  return (
    <IconLink
      icon={Home}
      size="2em"
      to="/newsfeed"
      color="white"
      backgroundColor="black"
    />
  );
};

export default NewsfeedBtn;
