import React from 'react';
import { Field, Form, Formik } from "formik";
import { Box, Button, FormControl, FormLabel, Input, VStack } from "@chakra-ui/react";

const AccountInformation = () => {
  return (
    <Box w='50%'>
      <Formik initialValues={{}} onSubmit={() => console.log('submit')}>
        {({}) => (
          <Form>
            <VStack>
              <FormControl>
                <FormLabel>Username</FormLabel>
                <Field as={Input} name='username'/>
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Field as={Input} name='email'/>
              </FormControl>
              <Button type="submit">Save</Button>
            </VStack>
          </Form>
        )}
      </Formik>
      <Formik initialValues={{}} onSubmit={() => console.log('submit')}>
        {({}) => (
          <Form>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Field as={Input} name='password'/>
            </FormControl>
            <Button type="submit">Change Password</Button>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AccountInformation;
