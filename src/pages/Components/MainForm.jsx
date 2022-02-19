import { Button, TextField } from '@mui/material';
import { Formik } from 'formik';
import * as Yup from 'yup';

const MainForm = (props) => {
  console.log('here');
  return (
    <div>
      <Formik
        initialValues={{
          description: '',
        }}
        validationSchema={Yup.object({
          description: Yup.string()
            .max(255, 'Must be 255 characters or less')
            .required('Required'),
        })}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          setSubmitting(false);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <TextField
              id="description"
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              helperText={touched.description ? errors.description : ''}
              error={touched.description && Boolean(errors.description)}
              margin="normal"
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
            >
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default MainForm;

{
  /* <Formik
      initialValues={{
        description: '',
      }}
      validationSchema={Yup.object({
        description: Yup.string()
          .max(255, 'Must be 255 characters or less')
          .required('Required'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        console.log(values);
        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        handleSubmit,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <TextField
            id="description"
            label="Description"
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            helperText={touched.description ? errors.description : ''}
            error={touched.description && Boolean(errors.description)}
            margin="normal"
            fullWidth
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            Submit
          </Button>
        </form>
      )}
    </Formik> */
}
