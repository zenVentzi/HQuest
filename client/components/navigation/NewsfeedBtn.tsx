import React from "react";
import IconLink from "Reusable/IconLink";
import { Home } from "styled-icons/material/Home";
import { Newspaper } from "styled-icons/icomoon/Newspaper";

const NewsfeedBtn = () => {
  return (
    <IconLink
      icon={Newspaper}
      size="2em"
      to="/newsfeed"
      color="white"
      backgroundColor="black"
      style={{ marginRight: "8px" }}
    />
  );
};

export default NewsfeedBtn;
