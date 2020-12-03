import { HTMLAttributes } from "react";
import { DateSectionName } from './types';
 
// Extend the default input attributes, allowing us to type data attributes

declare module 'react'
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    dataset: {
      section: DateSectionName;
    }
  }