import React, { type ReactElement, useEffect } from 'react'
import {
  Box,
  VStack,
  useColorModeValue,
  Button,
  Link,
  Divider,
  Text,
  Flex,
  Icon, Spacer
} from '@chakra-ui/react'
import { MdDeveloperBoard } from 'react-icons/md'
import { BiAperture, FiLogOut, VscAccount } from 'react-icons/all'
import { type IconType } from 'react-icons'
import MotionBox from './containers/MotionBox'
import { useKerbalUIController } from "../context";
import { useNavigate } from "react-router-dom";

interface NavbarButtonProp {
  leftIcon: ReactElement<IconType>
  text: string
  to: string
}

const Sidebar = () => {
  const buttonsProp: NavbarButtonProp[] = [
    { leftIcon: <MdDeveloperBoard/>, text: 'Domains', to: '/domain' },
    { leftIcon: <VscAccount/>, text: 'Account', to: '/account' },
    { leftIcon: <VscAccount/>, text: 'Board', to: '/board' }
  ]
  const variants = {
    hidden: { opacity: 1, x: '-100vw' },
    visible: { opacity: 1, x: '0' }
  }

  const bgColor = useColorModeValue('white', 'gray.700')
  const {controller} = useKerbalUIController()

  useEffect(() => {
    if (localStorage.getItem('selectedSidebarLinkIndex')) {
      return;
    }
    localStorage.setItem('selectedSidebarLinkIndex', '0')
  })

  const navigate = useNavigate()

  return (
    <MotionBox
      h='100vh'
      position='fixed'
      px='30px'
      zIndex='100'
      display='flex'
      alignItems='center'
      initial='visible'
      animate={controller.toggleSidebar ? 'visible' : 'hidden'}
      variants={variants}
      // @ts-ignore
      transition={{ duration: 0.5 }}
    >
      <Box
        w='250px'
        h='90vh'
        p='35px'
        bg={bgColor}
        borderRadius={15}
      >

        <Flex display='flex' alignItems='center' justifyContent='space-evenly'>
          <Icon as={BiAperture} boxSize={8}/>
          <Text fontSize='2xl' fontWeight='bold'>KERBAL</Text>
        </Flex>

        <Divider my='4' colorScheme='gray'/>

        <VStack
          spacing={8}
          alignItems="start"
          justifyContent="flex-center"
          width="100%"
          height='70%'
        >
          {buttonsProp.map((prop, index) => {
            return (
              <Link
                key={index}
                w='100%'
                href={prop.to}
                sx={{ _hover: { textDecoration: 'none' } }}
              >
                <Button
                  w='100%'
                  leftIcon={prop.leftIcon}
                  colorScheme='linkedin'
                  variant={parseInt(localStorage.getItem('selectedSidebarLinkIndex') as string) === index ? 'solid' : 'ghost'}
                  onClick={() => localStorage.setItem('selectedSidebarLinkIndex', index.toString())}
                >
                  {prop.text}
                </Button>
              </Link>
            )
          })}
          <Spacer/>
          <Button
            w='100%'
            leftIcon={<FiLogOut/>}
            variant='ghost'
            colorScheme='linkedin'
            onClick={() => {
              localStorage.clear()
              navigate('/login')
            }}
          >
            Log out
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  )
}

export default Sidebar
