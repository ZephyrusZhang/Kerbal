import React, { ReactElement, useState } from 'react';
import { Box, VStack, useColorModeValue, Button, useColorMode } from '@chakra-ui/react';
import { MdDeveloperBoard } from 'react-icons/md'
import { FaSignInAlt } from 'react-icons/fa'
import { BsFillPersonPlusFill } from 'react-icons/bs'
import { IoMdColorPalette } from "react-icons/all";
import { IconType } from "react-icons";

interface NavbarButtonProp {
  leftIcon: ReactElement<IconType>,
  text: string
}

const Navbar = () => {
  const buttonsProp: Array<NavbarButtonProp> = [
    {leftIcon: <MdDeveloperBoard/>, text: 'Dashboard'},
    {leftIcon: <FaSignInAlt/>, text: 'Sign In'},
    {leftIcon: <BsFillPersonPlusFill/>, text: 'Sign Up'}
  ]

  const bgColor = useColorModeValue('gray.800', 'gray.200')
  const [selected, setSelected] = useState(0)
  const {toggleColorMode} = useColorMode()

  return (
    <Box
      h='100vh'
      ml='30px'
      display='flex'
      alignItems='center'>
      <Box
        w='250px'
        h='90vh'
        p='35px'
        bg={bgColor}
        borderRadius={15}
      >
        <VStack
          spacing={8}
          alignItems="start"
          justifyContent="flex-center"
          width="100%"
        >
          {buttonsProp.map((prop, index) => {
            return (
              <Button
                key={index}
                w='100%'
                leftIcon={prop.leftIcon}
                colorScheme='linkedin'
                variant={selected === index ? 'solid' : 'ghost'}
                onClick={() => setSelected(index)}
              >
                {prop.text}
              </Button>
            )
          })}
          <Button variant='ghost' w='100%' leftIcon={<IoMdColorPalette/>} colorScheme='teal' onClick={toggleColorMode}>Theme</Button>
        </VStack>
      </Box>
    </Box>
  );
};

export default Navbar;