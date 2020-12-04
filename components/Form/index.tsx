import { Formik, Field } from 'formik';
import * as yup from 'yup';
import { FormFields, FormikSubmissionHandler, StageOneFieldNames } from './types';
import TextInput from '../TextInput';
import DateInput from 'components/DateInput';
import validationSchema from 'lib/validationSchema';

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
      <div className="form-container">
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {formik => {
            return (
              <>
                <form>
                  <Field name={StageOneFieldNames.firstName} label="First Name" component={TextInput} />
                  <Field name={StageOneFieldNames.lastName} label="Surname" component={TextInput} />
                  <Field name={StageOneFieldNames.email} label="Email" component={TextInput} />
                  <Field name={StageOneFieldNames.dob} label="Date of Birth" component={DateInput} format="DD/MM/YYYY" />
                </form>
              </>
            )
          }}
        </Formik>
      </div>
      <style jsx>
        {`
          .form-container {
            display: block;
            width: 600px;
            max-width: 100%;
            margin: 0 auto;
            padding: 2rem;
            background: var(--white);
            border-radius: 1rem;
            box-shadow: 0 14px 28px rgba(99, 102, 241, 0.1), 0 10px 10px rgba(0,0,0,0.025);
        `}
      </style>
    </>
  )
}