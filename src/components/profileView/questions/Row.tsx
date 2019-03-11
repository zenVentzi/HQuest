import styled from "styled-components";

interface RowProps {
  hide?: boolean;
}

export const Row = styled.div<RowProps>`
  display: flex;
  width: 100%;
  visibility: ${props => (props.hide ? "hidden" : "visible")};
  justify-content: center;
`;
