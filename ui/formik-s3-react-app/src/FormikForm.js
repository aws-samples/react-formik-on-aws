import './FormikForm.css';
import { Formik } from 'formik';

const handleOnSubmit = (values) => {
  const data = JSON.stringify(values);
  const file = new Blob([data], { type: 'application/json' });
  const fileName = 'employee.json'
  uploadToS3(file, fileName)
};

const uploadToS3 = async (file, fileName) => {
  const url = `${'INSERT API ENDPOINT CREATED BY CDK HERE'}/document?file=${fileName}&folder=documents`;
  const options = {
    method: 'PUT'
  }
  let preSignedUrl
  await fetch(url, options)
    .then(response => response.json())
    .then(data => preSignedUrl = data)
  console.log(preSignedUrl.url)
  const s3Options = {
    method: 'PUT',
    body: file
  }
  await fetch(preSignedUrl.url, s3Options)
};

const downloadFromS3 = () => {
  const url = `${'INSERT API ENDPOINT CREATED BY CDK HERE'}/document?file=documents/employee.json`;
  const options = {
    method: 'GET'
  }
  fetch(url, options)
    .then(response => response.json())
    .then(data => {
      const s3Options = {
        method: 'GET'
      }
      fetch(data.url, s3Options).then(
        response => response.json()
      ).then(data => {
        const a = document.createElement('a');
        const file = new Blob([JSON.stringify(data)], {type: 'application/json'});
        a.href= URL.createObjectURL(file);
        a.download = 'employee';
        a.click()
        URL.revokeObjectURL(a.href)
      })
    })
}

const FormikForm = () => {
  let initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    employeeId: '',
    gender: '',
    dob: '',
  };
  return (
    <div className='App'>
      <header className='App-header'>
        <div>ABC Company Employee Portal</div>
      </header>
      <div className='body'>
        <div className='query-form'>
          <Formik
            initialValues={initialValues}
            validate={(values) => {
              const errors = {};
              if (!values.email) {
                errors.email = 'Required';
              } else if (
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
              ) {
                errors.email = 'Invalid email address';
              }
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              handleOnSubmit(values);
              setSubmitting(false);
              values = {};
            }}>
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              /* and other goodies */
            }) => (
              <form onSubmit={handleSubmit}>
                <div className='dataField'>
                  <label>First Name</label>
                  <input
                    className='input'
                    type='text'
                    id='firstName'
                    value={values.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className='dataField'>
                  <label>Last Name</label>
                  <input
                    className='input'
                    type='text'
                    id='lastName'
                    value={values.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className='dataField'>
                  <label>Email</label>
                  <input
                    className='input'
                    type='text'
                    id='email'
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className='dataField'>
                  <label>Employee ID</label>
                  <input
                    className='input'
                    type='text'
                    id='employeeId'
                    value={values.employeeId}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className='dataField'>
                  <label>Gender</label>
                  <input
                    className='input'
                    type='text'
                    id='gender'
                    value={values.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className='dataField'>
                  <label>Date of Birth</label>
                  <input
                    className='input'
                    type='date'
                    id='dob'
                    value={values.dob}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                {errors.firstName && touched.firstName && errors.firstName}
                {errors.lastName && touched.lastName && errors.lastName}
                {errors.email && touched.email && errors.email}
                {errors.employeeId && touched.employeeId && errors.employeeId}
                <div className='button'>
                  <button
                    type='submit'
                    className='input'
                    disabled={isSubmitting}>
                    Upload Data
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
        <div className='button'>
          <button
            type='submit'
            className='input'
            onClick={downloadFromS3}>
            Download Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormikForm;
