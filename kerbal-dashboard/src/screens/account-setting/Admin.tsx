import React from 'react';
import { Field, Form, Formik } from "formik";
import { Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import { validateEmail, validatePassword } from "../../util/validate";
import request from "../../util/request";
import { useNavigate } from "react-router-dom";

interface FormProps {
  username: string,
  email: string,
  password: string,
  passwordConfirmation: string
}

const Admin = () => {
  const initialValues: FormProps = {
    username: '',
    email: '',
    password: '',
    passwordConfirmation: ''
  }
  const navigate = useNavigate()

  const validate = (values: FormProps): Partial<FormProps> => {
    return {
      ...validateEmail(values.email),
      ...validatePassword({password: values.password, passwordConfirmation: values.passwordConfirmation})
    }
  }

  const handleSubmit = async (values: FormProps) => {
    request.post(
      '/api/users/register',
      JSON.stringify({
        user_params: {
          'username': values.username,
          'email': values.email,
          'password': values.password
        }
      }),
      {withCredentials: true}
    ).then((response) => {
      localStorage.setItem('token', response.headers['Authorization'])
      navigate('/')
    })
  }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validate={validate}>
      {({errors, touched, handleSubmit}) => (
        <Form onSubmit={handleSubmit}>
          <VStack align='flex-start'>
            <FormControl>
              <FormLabel>Username</FormLabel>
              <Field as={Input} name='username' type='username'/>
            </FormControl>
            <FormControl isInvalid={!!(errors.email && touched.email)}>
              <FormLabel>Email</FormLabel>
              <Field as={Input} name='email' type='email'/>
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!(errors.password && touched.password)}>
              <FormLabel>Password</FormLabel>
              <Field as={Input} name='password' type='password'/>
              <FormErrorMessage>{errors.password}</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!(errors.passwordConfirmation && touched.passwordConfirmation)}>
              <FormLabel>Password Confirmation</FormLabel>
              <Field as={Input} name='passwordConfirmation' type='password'/>
              <FormErrorMessage>{errors.passwordConfirmation}</FormErrorMessage>
            </FormControl>
            <Button type='submit'>Create</Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}

export default Admin;
