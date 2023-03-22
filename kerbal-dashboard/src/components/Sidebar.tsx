import React, { ReactElement, useState } from 'react';
import {
  Box,
  VStack,
  useColorModeValue,
  Button,
  useColorMode,
  Link,
  Divider,
  Text,
  Flex,
  Icon, chakra, shouldForwardProp, useMediaQuery
} from '@chakra-ui/react';
import { MdDeveloperBoard } from 'react-icons/md'
import { FaSignInAlt } from 'react-icons/fa'
import { BsFillPersonPlusFill } from 'react-icons/bs'
import { BiAperture, IoMdColorPalette } from "react-icons/all";
import { IconType } from "react-icons";
import { isValidMotionProp, motion } from "framer-motion";

interface NavbarButtonProp {
  leftIcon: ReactElement<IconType>,
  text: string,
  to: string
}

const MotionBox = chakra(motion.div, {
  shouldForwardProp: (prop) => isValidMotionProp(prop) || shouldForwardProp(prop)
})

const Sidebar = () => {
  const buttonsProp: Array<NavbarButtonProp> = [
    {leftIcon: <MdDeveloperBoard/>, text: 'Dashboard', to: '/dashboard'},
    {leftIcon: <FaSignInAlt/>, text: 'Sign In', to: '/sign-in'},
    {leftIcon: <BsFillPersonPlusFill/>, text: 'Sign Up', to: '/sign-up'}
  ]
  const variants = {
    hidden: {opacity: 1, x: '-100vw', width: '0'},
    visible: {opacity: 1, x: '0'}
  }

  const bgColor = useColorModeValue('gray.800', 'gray.200')
  const normalColor = useColorModeValue('white', 'gray.600')
  const [selected, setSelected] = useState(0)
  const {toggleColorMode} = useColorMode()
  const [expanded] = useMediaQuery('(min-width: 768px)')

  return (
    <MotionBox
      h='100vh'
      position='fixed'
      px='30px'
      display='flex'
      alignItems='center'
      initial='visible'
      animate={expanded ? 'visible' : 'hidden'}
      variants={variants}
      // @ts-ignore
      transition={{duration: 0.5}}
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
                sx={{_hover: {textDecoration: 'none'}}}
              >
                <Button
                  w='100%'
                  leftIcon={prop.leftIcon}
                  colorScheme='linkedin'
                  variant={selected === index ? 'solid' : 'ghost'}
                  onClick={() => setSelected(index)}
                >
                  {prop.text}
                </Button>
              </Link>
            )
          })}
          <Button
            w='100%'
            variant='ghost'
            leftIcon={<IoMdColorPalette/>}
            colorScheme='teal'
            onClick={toggleColorMode}
          >
            Theme
          </Button>
        </VStack>
      </Box>
    </MotionBox>
  );
};

export default Sidebar;