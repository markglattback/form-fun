import { ErrorMessage } from "formik";
import validateDateArgs from "lib/validateDateArgs";
import { ChangeEvent, FocusEvent, SyntheticEvent, useCallback, useEffect, useMemo, useReducer, useRef} from "react";
import StyledErrorMessage from "styles/StyledErrorMessage";
import StyledIconContainer from "styles/StyledIconContainer";
import DateInputProvider, { useDateContext } from "./context";
import ResetButton from "./ResetButton";
import { InlineDateInputsContainer, StyledDateInputWrapper } from "./styles";
import { ComputedSectionName, DateInputLogicProps, DateInputProps, DateSectionName, DateSectionProps, GenerateSectionsProps, InputRefs } from "./types";
import useTouched from "./useTouched";

export default function DateInput({ label, field, form: { errors, touched, setFieldValue, setTouched }, format, ...props }: DateInputProps) {
  const sectionOrder: DateSectionName[] = format.split('/').map(val => val.slice(0, 1)) as DateSectionName[];
   
  return (
    <DateInputProvider sectionOrder={sectionOrder}>
      <DateInputLogic label={label} field={field} errors={errors} touched={touched} setFieldValue={setFieldValue} setTouched={setTouched} sectionOrder={sectionOrder} {...props} />
    </DateInputProvider>
  );  
}

function DateInputLogic({ label, field, errors, touched, setFieldValue, setTouched, sectionOrder, ...props}: DateInputLogicProps) { 
  const { values } = useDateContext();
  
  const isTouched = touched[field.name] ? true : false;
  const hasErrors = (isTouched && errors[field.name]) ? true : false;

  const [sectionsTouched, dispatchTouched] = useTouched();

  function handleSectionBlur(e: FocusEvent<HTMLInputElement>) { 
    const section = e.currentTarget.dataset.section as DateSectionName;
    dispatchTouched({ type: 'update', section, value: true });
  }

  // Refs used for focusing
  const inputRefs = {
    'D': useRef<HTMLInputElement>(null),
    'M': useRef<HTMLInputElement>(null),
    'Y': useRef<HTMLInputElement>(null),
  }

  // update formik field value
  useEffect(() => {   
    // make sure all values match formats
    if (values.D.length < 2) {
      setFieldValue(field.name, "Invalid Date");
    } else if (values.M.length < 2) {
      setFieldValue(field.name, "Invalid Date");
    } else if (values.Y.length < 4) {
      setFieldValue(field.name, "Invalid Date");
    } else {
      const year = parseInt(values.Y, 10);
      const month = parseInt(values.M, 10);
      const day = parseInt(values.D, 10);

      // pass an empty string to the formik field unless there's a valid date    
      setFieldValue(field.name, validateDateArgs(year, month, day) || "Invalid Date");
    };   

  }, [values['D'], values['M'], values['Y']]);
  
  // touch formik field
  useEffect(() => {
    if (sectionsTouched['D'] && sectionsTouched['M'] && sectionsTouched['Y']) {
      setTouched({ ...touched, [field.name]: true });
    }    
  }, [sectionsTouched['D'], sectionsTouched['M'], sectionsTouched['Y'],])
  

  return (
    <>
      <StyledDateInputWrapper>
        <input type="hidden" {...field} {...props} />
        <InlineDateInputsContainer isTouched={isTouched} hasErrors={hasErrors} value={field.value} >
            <GeneratedSections field={field} sectionOrder={sectionOrder} handleBlur={handleSectionBlur} inputRefs={inputRefs} values={values.valuesArray} />
          <label htmlFor={field.name}>
            {label}
          </label>
          <StyledIconContainer>
            {(hasErrors) && (<div className="error-icon"></div>)}
            <Reset inputRefs={inputRefs} sectionOrder={sectionOrder} />
          </StyledIconContainer>
        </InlineDateInputsContainer>
      </StyledDateInputWrapper>
      <StyledErrorMessage>
        <ErrorMessage name={field.name} component="span" />
      </StyledErrorMessage>
    </>
  )
}

function SectionInput ({ maxLength, name, section, inputRef, nextRef, onBlur }: DateSectionProps) {
  const { values, dispatch } = useDateContext();
  const placeholder = section === 'Y' ? 'YYYY' : `${section}${section}`;

  function handleChange (e: ChangeEvent<HTMLInputElement>) {
    // trim off excess in case of copy/paste
    let value = e.target.value.slice(0, maxLength);

    // don't update field if not a valid number
    const num = parseInt(value || '0', 10);
    if (isNaN(num)) return;
  
    if (value.length < 2) {
      if (section === 'D') {
        if (num > 3) value = `0${value}`;
      }
  
      if (section === 'M') {
        if (num > 1) value = `0${value}`
      }
    }    

    dispatch({ section, value });
  }
  
  function handleFocus (e: SyntheticEvent<HTMLInputElement>) {
    inputRef.current?.setSelectionRange(0, -1);
  }

  useEffect(() => {
    const next = values[section].length === maxLength;
    
    if (next) {
      if (nextRef) nextRef.current?.focus();
    }

  }, [values[section]]);

  return <input 
      id={name} 
      name={name} 
      ref={inputRef} 
      type="text" 
      inputMode="numeric" 
      pattern="[0-9]*" 
      maxLength={maxLength} 
      onChange={handleChange} 
      onFocus={handleFocus} 
      onBlur={onBlur}
      value={values[section]} 
      placeholder={placeholder} 
      data-section={section} 
    />
}

function GeneratedSections({ field, handleBlur, inputRefs, sectionOrder, values }: GenerateSectionsProps) {  
  const maxLengths = sectionOrder.map(section => section === 'Y' ? 4 : 2);
  const sectionOneHasValue = (values[0].length === maxLengths[0]);
  const sectionTwoHasValue = (values[1].length === maxLengths[1]);

  return (
    <>
      <SectionInput name={computeSectionName(field.name, sectionOrder[0])} maxLength={maxLengths[0]} section={sectionOrder[0]} onBlur={handleBlur} inputRef={inputRefs[sectionOrder[0]]} nextRef={inputRefs[sectionOrder[1]]} />
      <span className={!sectionOneHasValue ? "inactive" : undefined }>/</span>
      <SectionInput name={computeSectionName(field.name, sectionOrder[1])} maxLength={maxLengths[1]} section={sectionOrder[1]} onBlur={handleBlur} inputRef={inputRefs[sectionOrder[1]]} nextRef={inputRefs[sectionOrder[2]]} />
      <span className={!sectionTwoHasValue ? "inactive" : undefined }>/</span>
      <SectionInput name={computeSectionName(field.name, sectionOrder[2])} maxLength={maxLengths[2]} section={sectionOrder[2]} onBlur={handleBlur} inputRef={inputRefs[sectionOrder[2]]} nextRef={null} />
    </>
  )
}

function Reset({ inputRefs, sectionOrder }: { inputRefs: InputRefs, sectionOrder: DateSectionName[]}) {
  const { dispatch: dispatchValues } = useDateContext();

  function handleReset(e: SyntheticEvent<HTMLDivElement>) {   
    e.preventDefault();    
    inputRefs[sectionOrder[0]].current?.focus();
    dispatchValues({ section: 'reset', value: '' });
  }

  return (
    <div className="reset-icon" onMouseDown={handleReset}><ResetButton /></div>
  )
}

// return consistent names for all of our inputs
function computeSectionName(name: string, suffix: DateSectionName): ComputedSectionName {
  return `${name}-${suffix}` as ComputedSectionName;
}