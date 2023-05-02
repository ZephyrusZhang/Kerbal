import React, { type ReactElement, useState } from 'react'
import {
  Box,
  VStack,
  useColorModeValue,
  Button,
  Link,
  Divider,
  Text,
  Flex,
  Icon
} from '@chakra-ui/react'
import { MdDeveloperBoard } from 'react-icons/md'
import { FaSignInAlt } from 'react-icons/fa'
import { BsFillPersonPlusFill } from 'react-icons/bs'
import { BiAperture } from 'react-icons/all'
import { type IconType } from 'react-icons'
import { useKerbalUIController } from "../context";
import MotionBox from './containers/MotionBox'

interface NavbarButtonProp {
  leftIcon: ReactElement<IconType>
  text: string
  to: string
}

const Sidebar = () => {
  const buttonsProp: NavbarButtonProp[] = [
    { leftIcon: <MdDeveloperBoard/>, text: 'Dashboard', to: '/dashboard' },
    { leftIcon: <FaSignInAlt/>, text: 'Sign In', to: '/sign-in' },
    { leftIcon: <BsFillPersonPlusFill/>, text: 'Sign Up', to: '/sign-up' }
  ]
  const variants = {
    hidden: { opacity: 1, x: '-100vw', width: '0' },
    visible: { opacity: 1, x: '0' }
  }
  const {controller} = useKerbalUIController()

  const bgColor = useColorModeValue('gray.800', 'gray.200')
  const normalColor = useColorModeValue('white', 'gray.600')
  const [selected, setSelected] = useState(0)

  return (
    <MotionBox
      h='100vh'
      position='fixed'
      px='30px'
      zIndex='100'
      display='flex'
      alignItems='center'
      initial='visible'
      animate={controller.canSidebarHidden !== controller.isSidebarCollapse ? 'visible' : 'hidden'}
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
          <Icon as={BiAperture} boxSize={8} color={normalColor}/>
          <Text color={normalColor} fontSize='2xl' fontWeight='bold'>KERBAL</Text>
        </Flex>

        <Divider my='4' colorScheme='gray'/>

        <VStack
          spacing={8}
          alignItems="start"
          justifyContent="flex-center"
          width="100%"
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
                  variant={selected === index ? 'solid' : 'ghost'}
                  onClick={() => { setSelected(index) }}
                >
                  {prop.text}
                </Button>
              </Link>
            )
          })}
        </VStack>
      </Box>
    </MotionBox>
  )
}

export default Sidebar
