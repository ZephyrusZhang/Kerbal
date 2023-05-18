import React, { useState } from 'react';
import { Field, FieldProps, Form, Formik } from "formik";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import { AiOutlineCheck } from "react-icons/all";
import request from "../../util/request";

interface FormProps {
  username?: string,
  email?: string,
  password?: string,
}

const AccountInformation = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [action, setAction] = useState<string>()
  const [userParam, setUserParam] = useState<object>()
  const [currentPassword, setCurrentPassword] = useState<string>();

  const handleClickSave = (values: FormProps, fieldName: string) => {
    switch (fieldName) {
      case 'username':
        setAction('update_username')
        setUserParam({ username: values.username })
        break
      case 'email':
        setAction('update_email')
        setUserParam({ email: values.email })
        break
    }

    onOpen()
  }

  const handleSubmit = (values: unknown) => {
    onClose()
    console.log(values)
    // request.put('', values).then(response => {
    //   console.log(response)
    // })
  }

  return (
    <Box w='50%'>
      <Formik initialValues={{}} onSubmit={() => console.log('submit')}>
        {({}) => (
          <Form>
            <VStack>
              <Field name='username'>
                {({field, form}: FieldProps) => (
                  <FormControl>
                    <FormLabel>Username</FormLabel>
                    <HStack>
                      <Input {...field}/>
                      <IconButton
                        aria-label='check'
                        icon={<AiOutlineCheck/>}
                        onClick={() => handleClickSave(form.values, field.name)}
                      />
                    </HStack>
                  </FormControl>
                )}
              </Field>
              <Field name='email'>
                {({field, form}: FieldProps) => (
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <HStack>
                      <Input {...field}/>
                      <IconButton
                        aria-label='check'
                        icon={<AiOutlineCheck/>}
                        onClick={() => handleClickSave(form.values, field.name)}
                      />
                    </HStack>
                  </FormControl>
                )}
              </Field>
            </VStack>
          </Form>
        )}
      </Formik>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Current Password</ModalHeader>
          <ModalCloseButton />
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
            <Button variant='ghost' onClick={() => handleSubmit({
              action: action,
              current_password: currentPassword,
              user_param: userParam
            })}>Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
