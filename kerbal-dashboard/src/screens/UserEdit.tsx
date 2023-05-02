import React from "react";
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
    MdCheckCircle,
    MdSettings
  } from 'react-icons/all'
  import bgImage from "../assets/images/snow-tree.jpg"
  import request from '../util/request'
  import { useNavigate } from "react-router-dom";

interface FormProps {
    username: string
    email: string
    ori_password: string
    new_password: string
    passwordConfirm: string
  }

const UserEdit = () => {
    const formInitialValue: FormProps = {
        username: '',
        email: '',
        ori_password: '',
        new_password: '',
        passwordConfirm: ''
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,16}$/
      const navigate = useNavigate()
    
      const validate = (form: FormProps) => {
        const errors: Partial<FormProps> = {}
        // if (!emailRegex.test(form.email)) errors.email = 'Invalid email'
        // else if (form.email === '') errors.email = 'Email is required'

        if (form.ori_password !== ''){
            if (form.new_password === '') errors.new_password = 'New password is required'
            else if (!passwordRegex.test(form.new_password)) errors.new_password = 'Invalid new password'
        
            if (form.passwordConfirm !== form.new_password) errors.passwordConfirm = 'The new password entered twice does not match'
        }
      }
    
      const handleSubmit = async (values: FormProps) => {
        if (values.ori_password !== ''){
            request.post(
                '/api/users/reset_password',
                JSON.stringify({
                    user_params: {
                      "password": values.new_password,
                      "password_confirmation": values.passwordConfirm,
                      }
                  }),
                {withCredentials: true}
              ).then(() => 
                navigate('/')
              )
        }
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
                        <Text fontSize='2xl' fontWeight='bold' color='white' mb='10px'>Edit password</Text>
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
                            {/* <FormControl isInvalid={!!(errors.username && touched.username)}>
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
                            </FormControl> */}
                            {/* <FormControl isInvalid={!!(errors.email && touched.email)}>
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
                            </FormControl> */}
                            <FormControl isInvalid={!!(errors.ori_password && touched.ori_password)}>
                                <InputGroup>
                                <InputLeftElement><FiLock/></InputLeftElement>
                                <Input
                                    id='ori_password'
                                    name='ori_password'
                                    type='ori_password'
                                    onChange={handleChange}
                                    w='22vw' borderWidth={2}
                                    placeholder='Ori_Password'
                                />
                                </InputGroup>
                                <FormErrorMessage>{errors.ori_password}</FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={!!(errors.new_password && touched.new_password)}>
                                <InputGroup>
                                <InputLeftElement><FiLock/></InputLeftElement>
                                <Input
                                    id='new_password'
                                    name='new_password'
                                    type='new_password'
                                    onChange={handleChange}
                                    w='22vw' borderWidth={2}
                                    placeholder='New_Password'
                                />
                                </InputGroup>
                                <FormErrorMessage>{errors.new_password}</FormErrorMessage>
                            </FormControl>
                            <Flex w='100%' alignItems='left'>
                                <List>
                                <ListItem>
                                    <ListIcon as={MdCheckCircle} color='green.500' />
                                    Ori_password is mandatory if change.
                                </ListItem>
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
                                <FormErrorMessage>{errors.new_password}</FormErrorMessage>
                            </FormControl>

                            <Button type='submit' w='100%' colorScheme='blue'>Save</Button>
                            </VStack>
                        </Form>
                        )}
                    </Formik>
                </VStack>
            </Box>
        </Box>
      )
}

export default UserEdit