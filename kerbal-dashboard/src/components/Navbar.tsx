import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  HStack,
  Icon,
  IconButton,
  Popover,
  PopoverArrow, PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  useColorModeValue, VStack
} from '@chakra-ui/react'
import { AiOutlineMenu } from 'react-icons/ai'
import { IoIosSettings } from 'react-icons/io'
import ToggleColorModeButton from "./ToggleColorModeButton";
import { useNavigate } from "react-router-dom";
import { useKerbalUIController } from "../context";
import { parsePathSegments } from "../util/page";
import { BiAperture } from "react-icons/bi";
import { parsePayload } from "../util/jwt";

const Navbar = () => {
  const navigate = useNavigate()
  const {controller, dispatch} = useKerbalUIController()
  const [visible, setVisible] = useState(true);

  const handleMouseEnter = () => {
    setVisible(true)
  }

  const handleMouseLeave = () => {
    if (parsePathSegments(window.location.pathname)[0] == 'board' ||
        parsePathSegments(window.location.pathname)[0] == 'remote') {
      setVisible(false)
    }
  }

  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      // css={{ backdropFilter: 'blur(10px)' }}
      mt={visible ? '2vh' : '-75px'} // 控制显示和隐藏
      zIndex={2}
      transition="margin-top 0.7s"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Container
        display="flex"
        p='20px'
        bgColor={useColorModeValue('white', '#2f3136')}
        borderRadius='10px'
        maxW='70%'
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'} onClick={() => navigate('/')}>
            <HStack>
              <Icon as={BiAperture} mt='1' boxSize={8}/>
              <Text>Kerbal</Text>
            </HStack>
          </Heading>
        </Flex>

        <HStack alignItems='right' spacing={5}>
          <ToggleColorModeButton/>
          <IconButton
            aria-label='toggleSiderbar'
            icon={<AiOutlineMenu/>}
            bg='transparent'
            onClick={() => dispatch({...controller, toggleSidebar: !controller.toggleSidebar})}
          />
          <Popover>
            <PopoverTrigger>
              <IconButton aria-label='option' icon={<IoIosSettings/>} bg='transparent'/>
            </PopoverTrigger>
            <PopoverContent w='200px'>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Signed as <b>{parsePayload('user_id')}</b></PopoverHeader>
              <PopoverBody>
                <VStack align='flex-start'>
                  <Button w='full' variant='ghost' onClick={() => navigate('/account')}>Setting</Button>
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </HStack>
      </Container>
    </Box>
  )
}

export default Navbar
