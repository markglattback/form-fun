import { FieldProps } from "formik";
import { Dispatch, ReactNode, RefObject, FocusEvent, SyntheticEvent } from "react";

export type DayLiteral = 'D';
export type MonthLiteral = 'M';
export type YearLiteral = 'Y';
export type FormattedDay = `${DayLiteral}${DayLiteral}`;
export type FormattedMonth = `${MonthLiteral}${MonthLiteral}`;
export type FormattedYear = `${YearLiteral}${YearLiteral}${YearLiteral}${YearLiteral}`;


type ParentInputName = string;
export type DateSectionName = DayLiteral | MonthLiteral | YearLiteral;
export type ComputedSectionName = `${ParentInputName}-${DateSectionName}`;

export interface DateInputProps extends FieldProps {
  label: string;
  format: `${FormattedDay}/${FormattedMonth}/${FormattedYear}` 
  | `${FormattedMonth}/${FormattedDay}/${FormattedYear}` 
  | `${FormattedYear}/${FormattedMonth}/${FormattedDay}`;
}

export type DateInputLogicProps = Omit<DateInputProps, 'form' | 'format'> & {
  errors: FieldProps['form']['errors'];
  setFieldValue: FieldProps['form']['setFieldValue'];
  setTouched: FieldProps['form']['setTouched'];
  touched: FieldProps['form']['touched'];
  sectionOrder: DateSectionName[];
}

export type GenerateSectionsProps = Pick<DateInputProps, 'field'> & {
  inputRefs: InputRefs;
  sectionOrder: DateSectionName[];
  handleBlur: SectionInputBlurHandler;
  values: string[];
}

export interface DateSectionProps {
  name: ComputedSectionName;
  maxLength: 2 | 4;
  onBlur: SectionInputBlurHandler;
  section: DateSectionName;
  inputRef: RefObject<HTMLInputElement>;
  nextRef: RefObject<HTMLInputElement> | null;
}

interface SectionInputBlurHandler {
  (e: FocusEvent<HTMLInputElement>): void;
}

export type DateSectionOrder = {
  [P in DateInputProps['format']]?: DateSectionName[]; 
}

export type InputRefs = {
  [K in DateSectionName]: RefObject<HTMLInputElement>;
}


// Context Types

export type Values = {
  [K in DateSectionName]: string;
} & {
  valuesArray: string[];
  valuesString: string;
}


export interface Action {
  section: DateSectionName | 'reset';
  value: string;
}

export interface DateInputContext {
  values: Values;
  dispatch: Dispatch<Action>;
}

export interface ProviderProps {
  children: ReactNode;
  sectionOrder: DateSectionName[];
  // getSectionIndex: (section: DateSectionName) => number;
}