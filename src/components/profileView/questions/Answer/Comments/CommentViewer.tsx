import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const StyledViewer = styled.p`
  word-break: break-all;
  white-space: normal;
  text-align: left;
`;

interface CommentViewerProps {
  comment: string;
}

class CommentViewer extends Component<CommentViewerProps, any> {
  render() {
    const { comment } = this.props;
    return <StyledViewer>- {comment} </StyledViewer>;
  }
}

export default CommentViewer;
