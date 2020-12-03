import { FieldProps } from "formik";
import { ChangeEvent, InputHTMLAttributes, RefObject, SyntheticEvent } from "react";

export interface DateInputProps extends FieldProps {
  label: string;
  format: 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY/MM/DD';
}

type ParentInputName = string;
export type DateSectionName = 'D' | 'M' | 'Y';
export type ComputedSectionName = `${ParentInputName}-${DateSectionName}`;

export interface DateSectionProps {
  name: ComputedSectionName;
  maxLength: 2 | 4;
  onBlur: OnBlurHandler
  onChange: OnChangeHandler;
  onFocus: OnFocusHandler;
  section: DateSectionName;
  inputRef: RefObject<HTMLInputElement>;
}

export type GenerateSectionsProps = Pick<DateInputProps, 'field'> 
  & Pick<DateSectionProps, 'onBlur' | 'onChange' | 'onFocus'> 
  & {
    sectionsCompleted: {
      [K in 1 | 2 | 3]: boolean;
    };
    inputRefs: InputRefs;
    sectionOrder: DateSectionName[];
    values: string[];
  }


export type DateSectionOrder = {
  [P in DateInputProps['format']]?: DateSectionName[]; 
}

export type NewDateValue = {
  [K in DateSectionName]: string;
}

export type OnChangeHandler = (section: DateSectionName, value: string, position: {
  currentType: DateSectionName;
  next: boolean;
}) => void;

export type OnFocusHandler = (e: SyntheticEvent<HTMLInputElement>) => void;
export type OnBlurHandler = (e: SyntheticEvent<HTMLInputElement>) => void;

export type ValueState = {
  [K in DateSectionName]: string;
} & {
  valuesArray: string[];
  valuesString: string;
}

export type ValueReducerAction = {
  section: DateSectionName | 'reset';
  value: string;
}

export type InputRefs = {
  [K in DateSectionName]: RefObject<HTMLInputElement>;
}


