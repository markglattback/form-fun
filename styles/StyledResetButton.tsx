import styled from "styled-components";

export const StyledResetButton = styled.svg`
  fill: none;
  stroke: var(--grey400);
  stroke-linecap: square;
  stroke-miterlimit: 10;
  stroke-width: 2px;
  cursor: pointer;

  &:hover {
    stroke: var(--grey700);
  }
`