import React, { useState } from 'react'
import {
  Box, Button,
  Flex,
  FormControl, FormErrorMessage, FormLabel, IconButton,
  Input,
  InputGroup,
  InputLeftElement, InputRightElement, LightMode, Stack, Switch,
  Text,
  VStack
} from '@chakra-ui/react'
import { FiLock, HiOutlineMail, ImGithub, ImGoogle } from 'react-icons/all'
import { Form, Formik } from 'formik'
import { useNavigate } from "react-router-dom"
import request from "../util/request"
import { showToast } from "../util/toast";

interface FormProps {
  email: string
  password: string
  rememberMe: boolean
}

const AccountLogin = () => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const navigate = useNavigate()
  const validate = (form: FormProps) => {
    const errors: Partial<FormProps> = {}
    if (!emailRegex.test(form.email)) errors.email = 'Invalid email'
    if (form.email === '') errors.email = 'Email is required'

    if (form.password === '') errors.password = 'Password is required'

    return errors
  }

  const formInitialValue: FormProps = {
    email: '',
    password: '',
    rememberMe: false
  }

  const handleSubmit = async (values: FormProps) => {
    request.post(
      '/api/users/log_in',
      JSON.stringify({user_params: values}),
      {withCredentials: true}
    ).then((response) => {
      if (String(response.data.status) == "ok") {
        localStorage.setItem('token', response.data['token'])
        showToast('Login successfully', 'success')
        navigate('/')
      } else {
        showToast(String(response.data.reason), 'error')
      }
    })
  }

  const [showPassword, setShowPassword] = useState(false)
  const handleClickShowPassword = () => setShowPassword(!showPassword)

  return (
    <LightMode>
      <Box
        w='100vw'
        h='100vh'
        backgroundImage={`url(${require('../assets/images/galaxy.jpg')})`}
        display='flex'
        justifyContent='center'
        alignItems='center'
      >
        <Box
          px={8}
          py={8}
          bg='white'
          borderRadius={15}
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <VStack>
            <Box
              w='100%'
              h='15vh'
              borderRadius={12}
              bgGradient='linear(to-tr, #3a74e1, #609fea)'
              display='flex'
              justifyContent='center'
              alignItems='center'
              mt='-70px'
              mb='20px'
            >
              <Stack alignItems='center'>
                <Text fontSize='2xl' fontWeight='bold' color='white' mb='10px'>Sign In</Text>
                <Flex justifyContent='space-between' alignItems='center'>
                  <IconButton aria-label='github' colorScheme='transparent' icon={<ImGithub/>}/>
                  <IconButton aria-label='google' colorScheme='transparent' icon={<ImGoogle/>}/>
                </Flex>
              </Stack>
            </Box>

            <Formik initialValues={formInitialValue} onSubmit={handleSubmit} validate={validate}>
              {({
                  errors,
                  touched,
                  handleSubmit,
                  handleChange,
                  isSubmitting
                }) => (
                <Form onSubmit={handleSubmit}>
                  <VStack spacing={7}>
                    <FormControl isInvalid={!!(errors.email && touched.email)}>
                      <InputGroup>
                        <InputLeftElement><HiOutlineMail/></InputLeftElement>
                        <Input
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
                          name='password'
                          type={showPassword ? 'text' : 'password'}
                          onChange={handleChange} w='22vw'
                          borderWidth={2}
                          placeholder='Password'
                        />
                        <InputRightElement>
                          <Button onClick={handleClickShowPassword}>{showPassword ? 'Hide' : 'Show'}</Button>
                        </InputRightElement>
                      </InputGroup>
                      <FormErrorMessage>{errors.password}</FormErrorMessage>
                    </FormControl>
                    <Flex alignItems='center'>
                      <Switch name='rememberMe' onChange={handleChange}/>
                      <FormLabel color='gray' ml='20px' mb='1'>Remember me</FormLabel>
                    </Flex>

                    <Button type='submit' w='100%' colorScheme='blue' isLoading={isSubmitting}>LOGIN</Button>
                  </VStack>
                </Form>
              )}
            </Formik>
          </VStack>
        </Box>
      </Box>
    </LightMode>
  )
}

export default AccountLogin
