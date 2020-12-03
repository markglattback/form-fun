import { StyledInput } from "components/TextInput/styles";
import styled, { css } from "styled-components";
import StyledInputs from 'styles/StyledInputs';

interface StyledProps {
  hasFocus: boolean;
  hasErrors: boolean;
  isTouched: boolean;
  value: string;
}

export const StyledDateInputWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: min(100%, 200px);
`;

export const SpanContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, calc(1ch + 0.25rem));
  background: transparent;
  border: none;
  font-size: 1rem;
  padding: 1.25rem 0.75rem 0.375rem 0.75rem;
  font-family: ---apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-feature-settings: "tnum";
  font-variant-numeric: tabular-nums;
`;



export const InlineDateInputsContainer = styled.div<StyledProps>`
  /*  Default Wrapper Styles ----------  */

  display: flex;
  position: relative;
  margin: 1rem 0 0 0;
  background: ${({ isTouched }) => isTouched ? 'var(--white)' : 'var(--grey50)'};
  border: 1px solid ${({ hasErrors }) => hasErrors ? 'var(--errorRed)' : 'var(--grey300)' };
  border-radius: 0.5rem;
  /* width: min(100%, 200px); */
  width: 100%;

  /*  Focused Wrapper Styles ----------- */

  ${({ hasFocus }) => hasFocus && css`
    background: var(--white);
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary100);
  `}

  label {
    display: block;
    position: absolute;
    top: 0.375rem;
    margin-left: 0.75rem;
    font-size: 12px;
    line-height: 1;
    padding: 0;
    border-radius: 0.5rem;
    color: var(--grey400);
    
    /*  Active Label Styles ----------- */
    
    ${({  hasFocus }) => ( hasFocus ) && css`
      color: var(--primary);
    `}
  }

  input[maxlength="4"] {
    width: calc(4ch + 0.5rem);
  }
  
  input {
    background: transparent;
    width: calc(2ch + 0.25rem);
    border: none;
    font-size: 1rem;
    padding: 1.25rem 0px 0.375rem 0px;
    font-family: ---apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-feature-settings: "tnum";
    font-variant-numeric: tabular-nums;

    &::placeholder {
      color: var(--grey400);
      font-size: 12px;
    }

    &:nth-of-type(2) {
      padding-left: 2px;
      margin-right: -2px;
    }  

    &:nth-of-type(2)::placeholder {
      transform: translateX(-2px);
    }  

    &:first-of-type {
      padding-left: 0.75rem;
      margin-right: -3px;
    }

    &:last-of-type {
      flex: 1 0 auto;
    }

    &:focus {
      outline: none;
    }
  }

  span {
    display: flex;
    justify-content: center;
    padding: 1.25rem 0 0.375rem 0;
    width: 1ch;
    z-index: 0;
  }

  span.inactive {
    color: var(--grey400);
  }
`;