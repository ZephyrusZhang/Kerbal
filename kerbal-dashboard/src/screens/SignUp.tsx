import React from 'react'
import {
  Box, Button, Flex,
  FormControl,
  FormErrorMessage, IconButton,
  Input,
  InputGroup,
  InputLeftElement, List, ListIcon, ListItem, Stack, Text,
  VStack
} from '@chakra-ui/react'
import { Form, Formik } from 'formik'
import {
  AiOutlineUser,
  FiLock,
  HiOutlineMail,
  IoIosShareAlt,
  ImGithub,
  ImGoogle,
  MdCheckCircle,
  MdSettings
} from 'react-icons/all'
import bgImage from "../assets/images/fuji-mountain-with-milky-way-night.jpg"
import request from '../util/request'
import { useNavigate } from "react-router-dom";

interface FormProps {
  username: string
  email: string
  password: string
  passwordConfirm: string
}

const SignUp = () => {
  // const bgImage = require('../assets/images/night-ocean-landscape-full-moon-stars-shine.jpg')

  const formInitialValue: FormProps = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
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

  return (
    <Box
      w='100vw'
      h='100vh'
      backgroundImage={bgImage}
      backgroundSize='100% 100%'
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
              <Text fontSize='2xl' fontWeight='bold' color='white' mb='10px'>Sign Up</Text>
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
                  <Flex w='100%' alignItems='left'>
                    <List>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color='green.500' />
                        At least one lowercase letter.
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color='green.500' />
                        At least one uppercase letter.
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdCheckCircle} color='green.500' />
                        At least one digit.
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdSettings} color='green.500' />
                        At least one special character.
                      </ListItem>
                      <ListItem>
                        <ListIcon as={MdSettings} color='green.500' />
                        Length between 8-16.
                      </ListItem>
                    </List>
                  </Flex>
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
    </Box>
  )
}

export default SignUp
