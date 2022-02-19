import React from 'react';
import * as Yup from 'yup';

import { Box, Button, TextField, Grid } from '@mui/material';
import { Formik } from 'formik';
import './Popup.css';

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
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
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField label="Outlined" variant="outlined" />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
        </Formik>
      </header>
    </div>
  );
};

export default Popup;
