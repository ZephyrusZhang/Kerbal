import React, { useState } from 'react';
import { Field, FieldProps, Form, Formik } from "formik";
import {
  Box,
  Button,
  FormControl, FormErrorMessage,
  FormLabel,
  HStack,
  IconButton,
  Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure, VStack
} from "@chakra-ui/react";
import { AiOutlineCheck } from "react-icons/all";
import request from "../../util/request";
import { validateEmail, validatePassword } from "../../util/validate";
const AccountProfile = () => {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [action, setAction] = useState<string>()
  const [userParams, setUserParams] = useState<object>()
  const [currentPassword, setCurrentPassword] = useState('')

  const handleSubmit = (values: {[key: string]: unknown}, fieldName: 'username' | 'email' | 'password') => {
    console.log(values)
    switch (fieldName) {
      case 'username':
        setAction('update_username')
        setUserParams({username: values.username})
        break
      case 'email':
        setAction('update_email')
        setUserParams({email: values.email})
        break
      case 'password':
        setAction('update_password')
        setUserParams({password: values.password, password_confirmation: values.passwordConfirmation})
        break
    }
    onOpen()
  }

  const handleUpdate = (values: unknown) => {
    onClose()
    request.put('/api/users/settings', values).then(response => {
      console.log(response)
    })
  }

  return (
    <Box w='50%'>
      <VStack align='flex-start'>
        <Formik initialValues={{username: ''}} onSubmit={(values) => handleSubmit(values, 'username')}>
          <Form>
            <Field name='username'>
              {({field}: FieldProps) => (
                <FormControl>
                  <FormLabel>Username</FormLabel>
                  <HStack>
                    <Input {...field} type='username'/>
                    <IconButton
                      aria-label='check'
                      type='submit'
                      icon={<AiOutlineCheck/>}
                      // onClick={() => handleClickSave(form.values, field.name)}
                    />
                  </HStack>
                </FormControl>
              )}
            </Field>
          </Form>
        </Formik>
        <Formik initialValues={{email: ''}} onSubmit={(values) => handleSubmit(values, 'email')}>
          <Form>
            <Field name='email' validate={validateEmail}>
              {({field, form}: FieldProps) => (
                <FormControl isInvalid={!!(form.errors.email && form.touched.email)}>
                  <FormLabel>Email</FormLabel>
                  <HStack>
                    <Input {...field} type='email'/>
                    <FormErrorMessage>{form.errors.email as string}</FormErrorMessage>
                    <IconButton
                      aria-label='check'
                      type='submit'
                      icon={<AiOutlineCheck/>}
                    />
                  </HStack>
                </FormControl>
              )}
            </Field>
          </Form>
        </Formik>
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Current Password</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Input
              placeholder='Please input current password'
              type='password'
              required
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}/>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button variant='ghost' onClick={() => handleUpdate({
              action: action,
              current_password: currentPassword,
              user_params: userParams
            })}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Formik
        initialValues={{password: '', passwordConfirmation: ''}}
        onSubmit={(values) => handleSubmit(values, 'password')}
        validate={validatePassword}
      >
        {({
            errors,
            touched
          }) => (
          <Form>
            <VStack>
              <FormControl isInvalid={!!(errors.password && touched.password)}>
                <FormLabel>Password</FormLabel>
                <Field as={Input} name='password' type='password'/>
                <FormErrorMessage>{errors.password}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!(errors.passwordConfirmation && touched.passwordConfirmation)}>
                <FormLabel>Password Confirm</FormLabel>
                <Field as={Input} name='passwordConfirmation' type='password'/>
                <FormErrorMessage>{errors.passwordConfirmation}</FormErrorMessage>
              </FormControl>
              <Button type="submit">Change Password</Button>
            </VStack>
          </Form>
        )}
      </Formik>
    </Box>
  )
}

export default AccountProfile;
