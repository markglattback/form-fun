import { FormFields } from 'components/Form/types';
import * as yup from 'yup';


/*  VALIDATION SCHEMA  -------------------------- */

export default yup.object<Partial<FormFields>>({
  firstName: yup.string().required('Please enter your firstname'),
  lastName: yup.string().required('Please enter your surname'),
  email: yup.string().email('Please enter a valid email address').required('Please enter your email address'),
  dob: yup.date().typeError('Please provide a valid date')
});