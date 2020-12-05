import { Formik, Field } from 'formik';
import * as yup from 'yup';
import { FormFields, FormikSubmissionHandler, StageOneFieldNames, StageTwoFieldNames } from './types';
import TextInput from '../TextInput';
import DateInput from 'components/DateInput';
import validationSchema from 'lib/validationSchema';
import { FormContainer } from './styles';
import CheckBoxSlider from 'components/CheckBoxSlider';

/*  INITIAL VALUES  ----------------------------- */

const initialValues: FormFields = {
  firstName: '',
  lastName: '',
  email: '',
  mobile: '',
  dob: 'Invalid Date',
  likeChocolate: false,
  favChocolate: null,
  comments: ''
}

export default function Form() {

  const handleSubmit: FormikSubmissionHandler = async (values, { setSubmitting } ) => {
    // fake an API response
    setTimeout(() => {
      const success = Math.round(Math.random()); // 0 or 1

      if (success) {
        // handle success
      } else {
        // handle failure
      }

      setSubmitting(false);
    }, 1000);
  }

  return (
    <>
      <FormContainer>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {formik => {
            return (
              <>
                <form>
                  <Field name={StageOneFieldNames.firstName} label="First Name" component={TextInput} />
                  <Field name={StageOneFieldNames.lastName} label="Surname" component={TextInput} />
                  <Field name={StageOneFieldNames.email} label="Email" component={TextInput} />
                  <Field name={StageOneFieldNames.dob} label="Date of Birth" component={DateInput} format="DD/MM/YYYY" />
                  <Field name={StageTwoFieldNames.likeChocolate} label="Do you like chocolate?" component={CheckBoxSlider} />
                </form>
              </>
            )
          }}
        </Formik>
      </FormContainer>
    </>
  )
}