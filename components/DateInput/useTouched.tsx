import { useReducer } from "react";
import { DateSectionName } from "./types";

type Section = DateSectionName;

type State = {
  [S in Section]: boolean;
}

type Action = {
  type: 'update';
  section: Section;
  value: boolean;
} | { type: 'reset' };

const initialState: State = {
  D: false,
  M: false,
  Y: false,
}

function reducer(prevState: State, action: Action): State {
  switch(action.type) {
    case 'update':
      return { ...prevState, [action.section]: action.value };
    case 'reset':
      return initialState;
    default:
      return prevState;
  }
}

export default function useTouched() {
  return useReducer(reducer, initialState);
}