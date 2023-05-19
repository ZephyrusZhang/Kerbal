import React from 'react'
import {
  Box, Button, FormControl,
  FormErrorMessage, Input,
  InputGroup,
  InputLeftElement, useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import {
  AiOutlineUser,
  FiLock,
  HiOutlineMail,
  IoIosShareAlt
} from 'react-icons/all'
import request from '../util/request'
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";
import { emailRegex, passwordRegex } from "../const"

interface FormProps {
  username: string
  email: string
  password: string
  passwordConfirm: string
}

const AccountCreation = () => {
  // const bgImage = require('../assets/images/night-ocean-landscape-full-moon-stars-shine.jpg')

  const formInitialValue: FormProps = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }
  const navigate = useNavigate()

  const validate = (form: FormProps) => {
    const errors: Partial<FormProps> = {}
    if (!emailRegex.test(form.email)) errors.email = 'Invalid email'
    else if (form.email === '') errors.email = 'Email is required'

    if (form.password === '') errors.password = 'Password is required'
    else if (!passwordRegex.test(form.password)) errors.password = 'Invalid password'

    if (form.passwordConfirm !== form.password) errors.passwordConfirm = 'The password entered twice does not match'
  }

  const handleSubmit = async (values: FormProps) => {
    request.post(
      '/api/users/register',
      JSON.stringify({
          user_params: {
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

  const boxColor = useColorModeValue('#ffffff', '#414040')

  return (
    <MainLayout
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Box
        w='fit-content'
        bg={boxColor}
        px={8}
        py={8}
        borderRadius={15}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <VStack>
          <Formik initialValues={formInitialValue} onSubmit={handleSubmit} validate={validate}>
            {({
                errors,
                touched,
                handleSubmit,
                handleChange
              }) => (
              <Form onSubmit={handleSubmit}>
                <VStack spacing={7}>
                  <FormControl isInvalid={!!(errors.username && touched.username)}>
                    <InputGroup>
                      <InputLeftElement><AiOutlineUser/></InputLeftElement>
                      <Input
                        id='username'
                        name='username'
                        type='username'
                        w='22vw'
                        onChange={handleChange}
                        borderWidth={2}
                        placeholder='Username'
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!(errors.email && touched.email)}>
                    <InputGroup>
                      <InputLeftElement><HiOutlineMail/></InputLeftElement>
                      <Input
                        id='email'
                        name='email'
                        type='email'
                        w='22vw'
                        onChange={handleChange}
                        borderWidth={2}
                        placeholder='Email'
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!(errors.password && touched.password)}>
                    <InputGroup>
                      <InputLeftElement><FiLock/></InputLeftElement>
                      <Input
                        id='password'
                        name='password'
                        type='password'
                        onChange={handleChange}
                        w='22vw' borderWidth={2}
                        placeholder='Password'
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <FormControl isInvalid={!!(errors.passwordConfirm && touched.passwordConfirm)}>
                    <InputGroup>
                      <InputLeftElement><IoIosShareAlt/></InputLeftElement>
                      <Input
                        id='password'
                        name='password'
                        type='password'
                        onChange={handleChange}
                        w='22vw' borderWidth={2}
                        placeholder='Confirm Password'
                      />
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>

                  <Button type='submit' w='100%' colorScheme='blue'>SIGN UP</Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </VStack>
      </Box>
    </MainLayout>
  )
}

export default AccountCreation
