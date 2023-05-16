import React from 'react';
import { Field, Form, Formik } from "formik";
import { Box, Button, FormControl, FormErrorMessage, FormLabel, Input, VStack } from "@chakra-ui/react";

interface NameFormProps {
    ori_Name: string
    new_Name: string
  }

const AccountName = () => {
  const formInitialValue: NameFormProps = {
    ori_Name: '',
    new_Name: ''
  }

  const validate = (form: NameFormProps) => {
    const errors: Partial<NameFormProps> = {}

    if (form.new_Name === '') errors.new_Name = 'New Name is required'
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
              <FormControl isInvalid = {!!(errors.ori_Name && touched.ori_Name)}>
                <FormLabel>ori_Name</FormLabel>
                <Field as={Input} name='ori_Name' onChange={handleChange}/>
                <FormErrorMessage>{errors.ori_Name}</FormErrorMessage>
              </FormControl>

              <FormControl isInvalid = {!!(errors.new_Name && touched.new_Name)}>
                <FormLabel>new_Name</FormLabel>
                <Field as={Input} name='new_Name' onChange={handleChange}/>
                <FormErrorMessage>{errors.new_Name}</FormErrorMessage>
              </FormControl>
              <Button type="submit">Save</Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AccountName;
