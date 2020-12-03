import { ErrorMessage } from "formik";
import validateDateArgs from "lib/validateDateArgs";
import { ChangeEvent, Dispatch, SetStateAction, SyntheticEvent, useEffect, useRef, useState } from "react";
import StyledErrorMessage from "styles/StyledErrorMessage";
import StyledIconContainer from "styles/StyledIconContainer";
import DateInputContext, { useDateContext } from "./context";
import ResetButton from "./ResetButton";
import { InlineDateInputsContainer, StyledDateInputWrapper } from "./styles";
import { ComputedSectionName, DateInputProps, DateSectionName, DateSectionProps, GenerateSectionsProps, InputRefs, ParentChangeHandler } from "./types";

export default function DateInput({ label, field, form, format, ...props }: DateInputProps) {
  const sectionOrder: DateSectionName[] = format.split('/').map(val => val.slice(0, 1)) as DateSectionName[];
  
  function getSectionIndex(section: DateSectionName) {
    return sectionOrder.indexOf(section);
  }

  return (
    <DateInputContext getSectionIndex={getSectionIndex}>
      <DateInputLogic label={label} field={field} form={form} getSectionIndex={getSectionIndex} sectionOrder={sectionOrder} {...props} />
    </DateInputContext>
  );
}

function DateInputLogic({ label, field, form, getSectionIndex, sectionOrder, ...props}: Omit<DateInputProps, 'format'> & { getSectionIndex: (section: DateSectionName) => number; sectionOrder: DateSectionName[]}) {
  console.log('Logic Rerendering')
  const { values, dispatch } = useDateContext();
  
  // Formik state
  const isTouched = form.touched[field.name] ? true : false;
  const hasErrors = (isTouched && form.errors[field.name]) ? true : false;
  
  // State not included in Context
  const [hasFocus, setFocus] = useState<boolean>(false);
  const [currentIndex, setIndex] = useState<number>(0);
  const [sectionOneComplete, setSectionOneComplete] = useState(false);
  const [sectionTwoComplete, setSectionTwoComplete] = useState(false);
  const [sectionThreeComplete, setSectionThreeComplete] = useState(false);
  const sectionCompletedSetters = [setSectionOneComplete, setSectionTwoComplete, setSectionThreeComplete];

  // Refs used for focusing
  const inputRefs = {
    'D': useRef<HTMLInputElement>(null),
    'M': useRef<HTMLInputElement>(null),
    'Y': useRef<HTMLInputElement>(null),
  }

  function handleSectionChange(next: boolean) {
    // target next input
    if (next) {
      switch(currentIndex) {
        case 0: 
          setSectionOneComplete(true);
          setIndex(currentIndex + 1);
          break;
        case 1: 
          setSectionOneComplete(true);
          setIndex(currentIndex + 1);
          break;
        case 2: 
          setSectionOneComplete(true);
          break;
        default:
          break;
      }
    }    
  }

  function handleSectionFocus(e: SyntheticEvent<HTMLInputElement>) {      
    const { section } = e.currentTarget.dataset;
    const index = getSectionIndex(section as DateSectionName);
    setFocus(true);
    setIndex(index);
  }

  function handleSelectionBlur(e: SyntheticEvent<HTMLInputElement>) {
    
    const { section } = e.currentTarget.dataset;
    const index = getSectionIndex(section as DateSectionName);
    setFocus(false);
    sectionCompletedSetters[index](true);
  }

  /***  UPDATE FORMIK FIELD  ***/
  useEffect(() => {
     // make sure all values match formats
    if (values.D.length < 2) {
      sectionCompletedSetters[getSectionIndex('D')](false);
      form.setFieldValue(field.name, "Invalid Date");
    } else if (values.M.length < 2) {
      sectionCompletedSetters[getSectionIndex('M')](false);
      form.setFieldValue(field.name, "Invalid Date");
    } else if (values.Y.length < 4) {
      sectionCompletedSetters[getSectionIndex('Y')](false);
      form.setFieldValue(field.name, "Invalid Date");
    } else {
      const year = parseInt(values.Y, 10);
      const month = parseInt(values.M, 10);
      const day = parseInt(values.D, 10);

      // pass an empty string to the formik field unless there's a valid date    
      form.setFieldValue(field.name, validateDateArgs(year, month, day) || "Invalid Date");
    };   

    
  }, [values]);
  
  /***  TOUCH FORMIK FIELD  ***/
  useEffect(() => {  
    if (sectionOneComplete && sectionTwoComplete && sectionThreeComplete) {      
      form.setTouched({ ...form.touched, [field.name]: true });
    }
  }, [sectionOneComplete, sectionTwoComplete, sectionThreeComplete]);

  /***  TARGET NEXT SECTION  ***/
  useEffect(() => {  
    const key = `${sectionOrder[currentIndex]}` as DateSectionName;
    inputRefs[key].current?.focus();
  }, [currentIndex]);

  return (
    <>
      <StyledDateInputWrapper>
        <input type="hidden" {...field} {...props} />
        <InlineDateInputsContainer isTouched={isTouched} hasErrors={hasErrors} hasFocus={hasFocus} value={field.value} >
            <GeneratedSections field={field} sectionOrder={sectionOrder} onChange={handleSectionChange} inputRefs={inputRefs} onBlur={handleSelectionBlur} onFocus={handleSectionFocus} sectionsCompleted={{ 1: sectionOneComplete, 2: sectionTwoComplete, 3: sectionThreeComplete }} values={values.valuesArray} />
          <label htmlFor={field.name}>
            {label}
          </label>
          <StyledIconContainer>
            {(hasErrors && !hasFocus) && (<div className="error-icon"></div>)}
            <Reset inputRefs={inputRefs} sectionCompletedSetters={sectionCompletedSetters} sectionOrder={sectionOrder} />
          </StyledIconContainer>
        </InlineDateInputsContainer>
      </StyledDateInputWrapper>
      <StyledErrorMessage>
        <ErrorMessage name={field.name} component="span" />
      </StyledErrorMessage>
    </>
  )
}

function computeSectionName(name: string, suffix: DateSectionName): ComputedSectionName {
  return `${name}-${suffix}` as ComputedSectionName;
}

function SectionInput ({ maxLength, name, onChange, onBlur, onFocus, section, inputRef }: DateSectionProps) {
  console.log(`${section} rerendering`);
  
  const { values, dispatch } = useDateContext();
  const placeholder = section === 'Y' ? 'YYYY' : `${section}${section}`;

  function handleChangeWithContext (e: ChangeEvent<HTMLInputElement>) {
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

    onFocus(e);
  }

  useEffect(() => {
    onChange(values[section].length === maxLength);
  }, [values[section]]);

  return <input 
      id={name} 
      name={name} 
      ref={inputRef} 
      type="text" 
      inputMode="numeric" 
      pattern="[0-9]*" 
      maxLength={maxLength} 
      onChange={handleChangeWithContext} 
      onBlur={onBlur}
      onFocus={handleFocus} 
      value={values[section]} 
      placeholder={placeholder} 
      data-section={section} 
    />
}

function GeneratedSections({ field, inputRefs, onChange, onBlur, onFocus, sectionsCompleted, sectionOrder, values }: GenerateSectionsProps) {  
  const sectionOneHasValue = values[0] || false;
  const sectionTwoHasValue = values[1] || false;  

  return (
    <>
      <SectionInput name={computeSectionName(field.name, sectionOrder[0])} maxLength={sectionOrder[0] === 'Y' ? 4 : 2} section={sectionOrder[0]} inputRef={inputRefs[sectionOrder[0]]} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />
      <span className={(!sectionsCompleted[1] || !sectionOneHasValue)  ? "inactive" : undefined }>/</span>
      <SectionInput name={computeSectionName(field.name, sectionOrder[1])} maxLength={sectionOrder[1] === 'Y' ? 4 : 2} section={sectionOrder[1]} inputRef={inputRefs[sectionOrder[1]]} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />
      <span className={(!sectionsCompleted[2] || !sectionTwoHasValue) ? "inactive" : undefined }>/</span>
      <SectionInput name={computeSectionName(field.name, sectionOrder[2])} maxLength={sectionOrder[2] === 'Y' ? 4 : 2} section={sectionOrder[2]} inputRef={inputRefs[sectionOrder[2]]} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />
    </>
  )
}

function Reset({ inputRefs, sectionOrder, sectionCompletedSetters }: { inputRefs: InputRefs, sectionOrder: DateSectionName[], sectionCompletedSetters: Dispatch<SetStateAction<boolean>>[]}) {
  const { values, dispatch: dispatchValues } = useDateContext();

  function handleReset(e: SyntheticEvent<HTMLDivElement>) {       
    dispatchValues({ section: 'reset', value: '' });
    sectionCompletedSetters[0](false);
    sectionCompletedSetters[1](false);
    sectionCompletedSetters[2](false);
    inputRefs[sectionOrder[0]].current?.focus();
  }

  return (
    <div className="reset-icon" onClick={handleReset} ><ResetButton /></div>
  )
}

// TODO - improve performance, reduce number of re-renders