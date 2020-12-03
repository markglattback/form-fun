import { FieldProps } from "formik";
import { ChangeEvent, InputHTMLAttributes, RefObject, SyntheticEvent } from "react";

export type DayLiteral = 'D';
export type MonthLiteral = 'M';
export type YearLiteral = 'Y';
export type FormattedDay = `${DayLiteral}${DayLiteral}`;
export type FormattedMonth = `${MonthLiteral}${MonthLiteral}`;
export type FormattedYear = `${YearLiteral}${YearLiteral}${YearLiteral}${YearLiteral}`;

export interface DateInputProps extends FieldProps {
  label: string;
  format: `${FormattedDay}/${FormattedMonth}/${FormattedYear}` 
  | `${FormattedMonth}/${FormattedDay}/${FormattedYear}` 
  | `${FormattedYear}/${FormattedMonth}/${FormattedDay}`;
}

type ParentInputName = string;
export type DateSectionName = DayLiteral | MonthLiteral | YearLiteral;
export type ComputedSectionName = `${ParentInputName}-${DateSectionName}`;

export interface DateSectionProps {
  name: ComputedSectionName;
  maxLength: 2 | 4;
  onBlur: OnBlurHandler
  onChange: ParentChangeHandler;
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

export type ParentChangeHandler = (next: boolean) => void;

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


