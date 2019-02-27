import React from "react";
import IconLink from "Reusable/IconLink";
import { Home } from "styled-icons/material/Home";

const NewsfeedBtn = () => {
  return <IconLink icon={Home} to="/newsfeed" />;
};

export default NewsfeedBtn;
