import { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";
import { DateSectionName } from "./types";

type Values = {
  [K in DateSectionName]: string;
} & {
  valuesArray: string[];
  valuesString: string;
}


interface Action {
  section: DateSectionName | 'reset';
  value: string;
}

interface Context {
  values: Values;
  dispatch: Dispatch<Action>;
}

interface ProviderProps {
  children: ReactNode;
  getSectionIndex: (section: DateSectionName) => number;
}

const initialValues: Values = {
  D: '',
  M: '',
  Y: '',
  valuesArray: ['', '', ''],
  valuesString: ''
}

const store = createContext<Context>({
  values: initialValues,
  dispatch: (action: Action) => {},
});


export default function DateInputContext({ children, getSectionIndex }: ProviderProps) {
  function reducer(prevValues: Values, action: Action): Values {
    function makeNewValues(section: DateSectionName): Pick<Values, 'valuesArray' | 'valuesString'> {
      const index = getSectionIndex(section);

      const newValuesArray = [...prevValues.valuesArray];
      newValuesArray[index] = action.value;
      const newValuesString = newValuesArray.join('/');

      return { valuesArray: newValuesArray, valuesString: newValuesString };
    }

    switch(action.section) {
      case 'D':
        return { ...prevValues, D: action.value, ...makeNewValues('D') };
      case 'M':
        return { ...prevValues, M: action.value, ...makeNewValues('M') };
      case 'Y':
        return { ...prevValues, Y: action.value, ...makeNewValues('Y') };
      case 'reset':     
        return initialValues;
      default:
        return prevValues;
    }
  }

  const [ values, dispatch ] = useReducer(reducer, initialValues);
  const { Provider } = store;

  return (
    <Provider
      value={{
        values,
        dispatch: (action) => {          
          dispatch(action);
        }
      }}
    >
      {children}
    </Provider>
  )
}

export const useDateContext = () => useContext(store);