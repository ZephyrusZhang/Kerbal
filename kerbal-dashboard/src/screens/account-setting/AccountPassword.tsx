import React from 'react';
import { Field, Form, Formik } from "formik";
import { Box, Button, FormControl, FormLabel, FormErrorMessage, Input, VStack } from "@chakra-ui/react";

interface PasswordFormProps {
    ori_Password: string
    new_Password: string
  }

const AccountPassword = () => {
  const formInitialValue: PasswordFormProps = {
    ori_Password: '',
    new_Password: ''
  }

  const PasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/

  const validate = (form: PasswordFormProps) => {
    const errors: Partial<PasswordFormProps> = {}

    const ori_Password = "aughhhhhhhhh"
    if (!PasswordRegex.test(form.new_Password)) errors.new_Password = 'Invalid new Password'
    else if (form.ori_Password !== ori_Password) errors.ori_Password = "Wrong ori_Password"
    else if (form.new_Password === '') errors.new_Password = 'New Password is required'
  }

  return (
    <Box w='50%'>
      <Formik initialValues={formInitialValue} onSubmit={() => console.log('submit')} validate={validate}>
        {({
          errors,
          touched,
          handleSubmit,
          handleChange
        }) => (
          <Form onSubmit={handleSubmit}>
            <VStack>
              <FormControl isInvalid = {!!(errors.ori_Password && touched.ori_Password)}>
                <FormLabel>ori_Password</FormLabel>
                <Field as={Input} name='ori_Password' onChange={handleChange}/>
                <FormErrorMessage>{errors.ori_Password}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid = {!!(errors.new_Password && touched.new_Password)}>
                <FormLabel>new_Password</FormLabel>
                <Field as={Input} name='new_Password' onChange={handleChange}/>
                <FormErrorMessage>{errors.new_Password}</FormErrorMessage>
              </FormControl>
              <Button type="submit">Change Password</Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AccountPassword;
