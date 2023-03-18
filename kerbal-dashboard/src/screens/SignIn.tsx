import React, { useState } from 'react';
import {
  Box, Button,
  Flex,
  FormControl, FormLabel, IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Stack, Switch,
  Text,
  VStack
} from "@chakra-ui/react";
import { FiLock, HiOutlineMail, ImGithub, ImGoogle } from "react-icons/all";

const SignIn = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
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
        <VStack spacing='5'>
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

          <FormControl>
            <InputGroup>
              <InputLeftElement children={<HiOutlineMail/>}/>
              <Input w='22vw' borderWidth={2} placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </InputGroup>
          </FormControl>
          <FormControl>
            <InputGroup>
              <InputLeftElement children={<FiLock/>}/>
              <Input w='22vw' borderWidth={2} placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}/>
            </InputGroup>
          </FormControl>
          <FormControl display='flex' alignItems='center'>
            <Switch/>
            <FormLabel color='gray' ml='20px' mb='1'>Remember Me</FormLabel>
          </FormControl>

          <Button w='100%' colorScheme='blue' >SIGN IN</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default SignIn;
