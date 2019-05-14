import styled from "styled-components";
import { CSSProperties } from "react";

interface RowProps {
  hide?: boolean;
  // justifyContent?: CSSProperties["justifyContent"];
}

export const Row = styled.div<RowProps>`
  display: flex;
  width: 100%;
  visibility: ${props => (props.hide ? "hidden" : "visible")};
  justify-content: center;
`;
