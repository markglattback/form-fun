import { createContext, useContext, useMemo, useReducer } from "react";
import { Action, DateSectionName, DateInputContext, ProviderProps, Values } from "./types";

const initialValues: Values = {
  D: '',
  M: '',
  Y: '',
  valuesArray: ['', '', ''],
  valuesString: ''
}

const store = createContext<DateInputContext>({
  values: initialValues,
  dispatch: (action: Action) => {},
});


export default function DateInputProvider({ children, getSectionIndex }: ProviderProps) {
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

  const memoisedValues = useMemo(() => ({ values, dispatch }), [values['D'], values['M'], values['Y'], values['valuesArray'], values['valuesString']]);

  return (
    <Provider value={memoisedValues}>
      {children}
    </Provider>
  )
}

export const useDateContext = () => {
  const context = useContext(store);
  if (!context)
    throw new Error('DateInputContext must be used within DateInputPovider.')
  return context;
}