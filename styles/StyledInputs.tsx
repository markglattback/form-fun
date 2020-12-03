import styled, { css } from 'styled-components';

interface StyledProps {
  hasFocus: boolean;
  hasErrors: boolean;
  isTouched: boolean;
  value: string;
}

export default styled.div<StyledProps>`

  /*  Default Wrapper Styles ----------  */

  display: flex;
  position: relative;
  margin: 1rem 0 0 0;
  background: ${({ isTouched }) => isTouched ? 'var(--white)' : 'var(--grey50)'};
  border: 1px solid ${({ hasErrors }) => hasErrors ? 'var(--errorRed)' : 'var(--grey300)' };
  border-radius: 0.5rem;
  width: min(100%, 400px);

  /*  Focused Wrapper Styles ----------- */

  ${({ hasFocus }) => hasFocus && css`
    background: var(--white);
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary100);
  `}

  /*  Inactive Label Styles ----------- */

  label {
    display: flex;
    align-items: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    border-radius: 0.5rem;
    padding: 0.75rem;
    color: var(--grey400);
    transition: 0.1s;
    
    /*  Active Label Styles ----------- */
    
    ${({ isTouched, hasFocus }) => ( hasFocus || isTouched ) && css`
      display: block;
      top: 0.375rem;
      margin-left: 0.75rem;
      font-size: 12px;
      line-height: 1;
      padding: 0;
    `}
    
    ${({ isTouched, hasFocus, hasErrors, value }) => (!hasFocus && ((hasErrors && isTouched) && !value)) && css`
      display: flex;
      align-items: center;
      position: absolute;
      top: 0;
      width: 100%;
      margin-left: 0;
      box-sizing: border-box;
      /* background: var(--red50); */
      font-size: 1rem;
      line-height: inherit;
      border-radius: 0.5rem;
      padding: 0.75rem;
    `}

    /*  Error Label Styles ------------ */

    ${({ hasErrors }) => hasErrors && css`
      color: var(--errorRed);
    `}

    /*  Focus Label Styles ------------ */

    ${({ hasFocus }) => hasFocus && css`
      color: var(--primary);
    `}
  }

  /*  Input Styles -------------- */

  input, select, textarea {
    position: relative;
    width: 100%;
    margin-bottom: -3px; // to position chrome autofill menu below box-shadow
    padding: 1.25rem 0.75rem calc(0.375rem + 3px) 0.75rem;
    background: transparent;
    border: none;
    box-sizing: border-box;
    font-size: 1rem;
    line-height: 1;
    color: var(--grey700);
    z-index: 1;

    ${({ hasErrors }) => hasErrors && css`


    `}


    /*  Focused Input Styles -------------- */

    &:focus {
      outline: none;
    }

    /*  Chrome Autofill Styles------------- */

    &:-webkit-autofill,
    &:-webkit-autofill:hover,
    &:-webkit-autofill:focus,
    &:-webkit-autofill:active {
      /* Match input styles */
      box-sizing: border-box;
      border-radius: 0.5rem;
      -webkit-text-fill-color: var(--grey700) !important;
      
      /* Put off the transition - remove if deemed anti-UX */
      transition: background 5000s 5000s cubic-bezier(1, -1, 1, -1);
    }
  }
`;