import React from 'react';
import {
  Box, Button,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  InputGroup,
  InputLeftElement, Text,
  VStack
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { AiOutlineUser, FiLock, HiOutlineMail, IoIosShareAlt } from "react-icons/all";

interface FormProps {
  username: string,
  email: string,
  password: string,
  passwordConfirm: string,
}

const SignUp = () => {
  const bgImage = require('../assets/images/night-ocean-landscape-full-moon-stars-shine.jpg')

  const formInitialValue: FormProps = {
    username: '',
    email: '',
    password: '',
    passwordConfirm: ''
  }

  const validate = (form: FormProps) => {

  }

  const handleSubmit = () => {

  }

  return (
    <Box
      w='100vw'
      h='100vh'
      pt='20px'
      px='16px'
      justifyContent='center'
      position='relative'
    >
      <Box w='100%' zIndex='0' position='relative'>
        <Image
          boxSize='100%'
          borderRadius='20'
          src={bgImage}
          alt='night-ocean-landscape-full-moon-stars-shine'
        />
      </Box>

      <VStack
        px={8}
        py={8}
        position='absolute'
        left='50%'
        top='50%'
        transform='translate(-50%, -50%)'
        zIndex='1'
        bgColor='white'
        borderRadius={12}
      >
        <Box
          w='100%'
          h='15vh'
          borderRadius={12}
          bgGradient='linear(to-tr, #3a74e1, #609fea)'
          mt='-70px'
          mb='20px'
          display='flex'
          justifyContent='center'
          alignItems='center'
        >
          <Text fontSize='2xl' fontWeight='bold' color='white' mb='10px'>Create an account !!!</Text>
        </Box>

        <Formik initialValues={formInitialValue} onSubmit={handleSubmit}>
          {({errors, touched, handleSubmit, handleChange}) => (
            <Form onSubmit={handleSubmit}>
              <VStack spacing={7}>
                <FormControl isInvalid={!!(errors.username && touched.username)}>
                  <InputGroup>
                    <InputLeftElement children={<AiOutlineUser/>}/>
                    <Input type='username' w='22vw' onChange={handleChange} borderWidth={2} placeholder='Username'/>
                  </InputGroup>
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(errors.email && touched.email)}>
                  <InputGroup>
                    <InputLeftElement children={<HiOutlineMail/>}/>
                    <Input type='email' w='22vw' onChange={handleChange} borderWidth={2} placeholder='Email'/>
                  </InputGroup>
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(errors.password && touched.password)}>
                  <InputGroup>
                    <InputLeftElement children={<FiLock/>}/>
                    <Input type='password' onChange={handleChange} w='22vw' borderWidth={2} placeholder='Password'/>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(errors.passwordConfirm && touched.passwordConfirm)}>
                  <InputGroup>
                    <InputLeftElement children={<IoIosShareAlt/>}/>
                    <Input type='password' onChange={handleChange} w='22vw' borderWidth={2} placeholder='Confirm Password'/>
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
  );
};

export default SignUp;
