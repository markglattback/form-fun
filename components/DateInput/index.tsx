import { ErrorMessage } from 'formik';
import validateDateArgs from 'lib/validateDateArgs';
import { ChangeEvent, Dispatch, RefObject, SetStateAction, SyntheticEvent, useEffect, useReducer, useRef, useState } from 'react';
import StyledErrorMessage from 'styles/StyledErrorMessage';
import StyledIconContainer from 'styles/StyledIconContainer';
import * as yup from 'yup';
import DateInputContext, { useDateContext } from './context';
import ResetButton from './ResetButton';
import { InlineDateInputsContainer, SpanContainer, StyledDateInputWrapper } from './styles';
import { ComputedSectionName, DateInputProps, DateSectionName, DateSectionProps, GenerateSectionsProps, InputRefs, NewDateValue, ParentChangeHandler, ValueReducerAction, ValueState } from './types';


const validationSchema = yup.object().shape({
  DD: yup.number().lessThan(32).moreThan(0),
  MM: yup.number().lessThan(13).moreThan(0),
  YYYY: yup.number().moreThan(0),
})

function computeSectionName(name: string, suffix: DateSectionName): ComputedSectionName {
  // eg. birthday-DD or birthday-MM
  return `${name}-${suffix}` as ComputedSectionName;
}

function SectionInput ({ maxLength, name, onChange, onBlur, onFocus, section, inputRef }: DateSectionProps) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const placeholder = section === 'Y' ? 'YYYY' : `${section}${section}`;

  const { values, dispatch } = useDateContext();

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

  // function handleChange(e: ChangeEvent<HTMLInputElement>) {
  //   // trim off excess in case of copy/paste
  //   let value = e.target.value.slice(0, maxLength);

  //   // don't update field if not a valid number
  //   const num = parseInt(value || '0', 10);
  //   if (isNaN(num)) return;
  
  //   if (value.length < 2) {
  //     if (section === 'D') {
  //       if (num > 3) value = `0${value}`;
  //     }
  
  //     if (section === 'M') {
  //       if (num > 1) value = `0${value}`
  //     }
  //   }


  //   setValue(value);
  // }
  
  function handleFocus (e: SyntheticEvent<HTMLInputElement>) {
    inputRef.current?.setSelectionRange(0, -1);

    onFocus(e);
  }

  useEffect(() => {
    onChange(value.length === maxLength);
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
    style={error ? { color: 'var(--errorRed)' } : {}} />
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


export default function DateInput({ label, field, form: { touched, errors, setFieldValue, setTouched, values }, format, ...props  }: DateInputProps) { 
  const isTouched = touched[field.name] ? true : false;
  const hasErrors = (isTouched && errors[field.name]) ? true : false;
  const [hasFocus, setFocus] = useState<boolean>(false);
  const [currentIndex, setIndex] = useState< 0 | 1| 2  | number>(0);
  const [sectionOneComplete, setSectionOneComplete] = useState(false);
  const [sectionTwoComplete, setSectionTwoComplete] = useState(false);
  const [sectionThreeComplete, setSectionThreeComplete] = useState(false);
  const sectionCompletedSetters = [setSectionOneComplete, setSectionTwoComplete, setSectionThreeComplete];
  const sectionOrder: DateSectionName[] = format.split('/').map(val => val.slice(0,1)) as DateSectionName[]; 

  /*** HELPER TO KEEP INDEXES CONSISTANT BASED ON FORMAT ***/

  function getSectionIndex(section: DateSectionName) {
    return sectionOrder.indexOf(section);
  }

  const { values: internalValues, dispatch: dispatchValues } = useDateContext();


  // /*** INTERNAL VALUE STATE SETUP WITH USEREDUCER ***/

  // const initialState: ValueState = {
  //   D: '',
  //   M: '',
  //   Y: '',
  //   valuesArray: ['', '', ''],
  //   valuesString: ''
  // }
  
  // const reducer = (prevState: ValueState, action: ValueReducerAction): ValueState => {

  //   function makeNewValues(section: DateSectionName): Pick<ValueState, 'valuesArray' | 'valuesString'> {
  //     const index = getSectionIndex(section);

  //     const newValuesArray = [...prevState.valuesArray];
  //     newValuesArray[index] = action.value;
  //     const newValuesString = newValuesArray.join('/');

  //     return { valuesArray: newValuesArray, valuesString: newValuesString };
  //   }

  //   switch(action.section) {
  //     case 'D':
  //       return { ...prevState, D: action.value, ...makeNewValues('D') };
  //     case 'M':
  //       return { ...prevState, M: action.value, ...makeNewValues('M') };
  //     case 'Y':
  //       return { ...prevState, Y: action.value, ...makeNewValues('Y') };
  //     case 'reset':
  //       return initialState;
  //     default:
  //       return prevState;
  //   }
  // }

  // const [internalValues, dispatchValues] = useReducer(reducer, initialState);

  // used to focus on the next input
  const inputRefs = {
    'D': useRef<HTMLInputElement>(null),
    'M': useRef<HTMLInputElement>(null),
    'Y': useRef<HTMLInputElement>(null),
  }

  const handleSectionChange: ParentChangeHandler = (next) => {     
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
    console.log('useeffect being called');
    

    // make sure all values match formats
    if (internalValues.D.length < 2) {
      sectionCompletedSetters[getSectionIndex('D')](false);
      setFieldValue(field.name, "Invalid Date");
    } else if (internalValues.M.length < 2) {
      sectionCompletedSetters[getSectionIndex('M')](false);
      setFieldValue(field.name, "Invalid Date");
    } else if (internalValues.Y.length < 4) {
      sectionCompletedSetters[getSectionIndex('Y')](false);
      setFieldValue(field.name, "Invalid Date");
    } else {
      const year = parseInt(internalValues.Y, 10);
      const month = parseInt(internalValues.M, 10);
      const day = parseInt(internalValues.D, 10);

      // pass an empty string to the formik field unless there's a valid date    
      setFieldValue(field.name, validateDateArgs(year, month, day) || "Invalid Date");
    };   

    
  }, [internalValues])
  
  /***  TOUCH FORMIK FIELD  ***/
  useEffect(() => {  
    if (sectionOneComplete && sectionTwoComplete && sectionThreeComplete) {      
      setTouched({ ...touched, [field.name]: true });
    }
  }, [sectionOneComplete, sectionTwoComplete, sectionThreeComplete]);

  /***  TARGET NEXT SECTION  ***/
  useEffect(() => {  
    const key = `${sectionOrder[currentIndex]}` as DateSectionName;
    inputRefs[key].current?.focus();
  }, [currentIndex]);

  return (
    <DateInputContext getSectionIndex={getSectionIndex}>
      <StyledDateInputWrapper>
        <input type="hidden" {...field} {...props} />
        <InlineDateInputsContainer isTouched={isTouched} hasErrors={hasErrors} hasFocus={hasFocus} value={field.value} >
            <GeneratedSections field={field} sectionOrder={sectionOrder} onChange={handleSectionChange} inputRefs={inputRefs} onBlur={handleSelectionBlur} onFocus={handleSectionFocus} sectionsCompleted={{ 1: sectionOneComplete, 2: sectionTwoComplete, 3: sectionThreeComplete }} values={internalValues.valuesArray} />
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
    </DateInputContext>
  )
}

// TODO: Implement context and build out RESET button functionality

