import { FocusEvent, useEffect, useState } from "react";
import { TextInputProps } from "./types";
import { StyledInput, StyledErrorMessage, StyledIconContainer, StyledInputContainer } from './styles';
import { format } from "path";
import { ErrorMessage } from "formik";

export default function TextInput({ label, field, form: { errors, touched, setTouched }, ...props }: TextInputProps) {
  const isTouched = touched[field.name] ? true : false;
  const hasErrors = (isTouched && errors[field.name]) ? true : false;
  const [hasFocus, setFocus] = useState<boolean>(false);  
  
  const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
    setFocus(true);
  }

  const customHandleBlur = (e: FocusEvent<HTMLInputElement>): void => {
    setFocus(false);
    field.onBlur(e);
  }

  useEffect(() => { 
    if (field.value) {      
      setTouched({ ...touched, [field.name]: true });
    }
  }, [field.value]);

  return (
    <>
      <StyledInput hasErrors={hasErrors} hasFocus={hasFocus} isTouched={isTouched} value={field.value}>
        <StyledInputContainer>
          <input
            type="text"
            {...field}
            {...props}
            onFocus={handleFocus}
            onBlur={customHandleBlur}
          />
          <label htmlFor={field.name}>
            {label}
          </label>
        </StyledInputContainer>
        <StyledIconContainer>
          {(hasErrors && !hasFocus) && (<div className="error-icon"></div>)}
        </StyledIconContainer>
      </StyledInput>
      <StyledErrorMessage>
        <ErrorMessage name={field.name} component="span" />
      </StyledErrorMessage>
    </>
  )
}