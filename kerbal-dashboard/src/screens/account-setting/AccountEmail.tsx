import React from 'react';
import { Field, Form, Formik } from "formik";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";
import { error } from 'console';

interface EmailFormProps {
    ori_Email: string
    new_Email: string
  }

const AccountEmail = () => {
  const formInitialValue: EmailFormProps = {
    ori_Email: '',
    new_Email: ''
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  const validate = (form: EmailFormProps) => {
    const errors: Partial<EmailFormProps> = {}

    const ori_Email = "114514@1919810.com"
    if (!emailRegex.test(form.new_Email)) errors.new_Email = 'Invalid new email'
    else if (form.ori_Email !== ori_Email) errors.ori_Email = "Wrong ori_email"
    else if (form.new_Email === '') errors.new_Email = 'New email is required'
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
              <FormControl isInvalid = {!!(errors.ori_Email && touched.ori_Email)}>
                <FormLabel>ori_Email</FormLabel>
                <Field as={Input} name='ori_Email' onChange={handleChange}/>
                <FormErrorMessage>{errors.ori_Email}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid = {!!(errors.new_Email && touched.new_Email)}>
                <FormLabel>new_Email</FormLabel>
                <Field as={Input} name='new_Email' onChange={handleChange}/>
                <FormErrorMessage>{errors.new_Email}</FormErrorMessage>
              </FormControl>
              <Button type="submit">Save</Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AccountEmail;
