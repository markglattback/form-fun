/*  STAGE ONE  ---------------------------------- */

import { FormikHelpers } from "formik"

export enum StageOneFieldNames {
  'firstName' = 'firstName', // text
  'lastName' = 'lastName', // text
  'email' = 'email', // text
  'mobile' = 'mobile', // text [numerical with pattern]
  'dob' = 'dob', // text but formed of three inputs
}

export interface StageOneFields {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  dob: Date | string;
}

/*  STAGE TWO  ---------------------------------- */

export enum StageTwoFieldNames {
  'likeChocolate' = 'likeChocolate', // checkbox slider
  'favChocolate' = 'favChocolate', // select
}

export enum Chocolate {
  'Mars' = 'Mars',
  'Snickers' = 'Snickers',
  'Bounty' = 'Bounty',
  'Malteser' = 'Malteser',
}

export interface StageTwoFields {
  likeChocolate: boolean;
  favChocolate: Chocolate | null,
}

/*  STAGE THREE  -------------------------------- */

export enum StageThreeFieldNames {
  'comments' = 'comments', // textarea
}

export interface StageThreeFields {
  comments: string;
}

/*  STAGE TITLES  ------------------------------- */

export enum FormStages {
  'PERSONAL_DETAILS' = 'Personal Details',
  'CHOCOLATE_PREFERENCE' = 'Chocolate Preference',
  'COMMENTS' = 'Additional Comments'
}

/*  FORM VALUES SETUP  -------------------------- */

export type FormFields = StageOneFields & StageTwoFields & StageThreeFields

export interface FormValues {
  1: {
    title: FormStages.PERSONAL_DETAILS,
    stage: 1,
    fields: StageOneFields
  };
  2: {
    title: FormStages.CHOCOLATE_PREFERENCE,
    stage: 2,
    fields: StageTwoFields
  };
  3: {
    title: FormStages.COMMENTS,
    stage: 3,
    fields: StageThreeFields
  }
}

export type FormikSubmissionHandler = (values: FormFields, formikHelpers: FormikHelpers<FormFields>) => void | Promise<any>;