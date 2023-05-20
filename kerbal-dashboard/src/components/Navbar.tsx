import React, { useState } from 'react';
import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList, useColorModeValue
} from '@chakra-ui/react'
import { AiOutlineMenu } from 'react-icons/ai'
import { IoIosSettings } from 'react-icons/io'
import ToggleColorModeButton from "./ToggleColorModeButton";
import { useNavigate } from "react-router-dom";
import { useKerbalUIController } from "../context";

const Navbar = () => {
  const navigate = useNavigate()
  const {controller, dispatch} = useKerbalUIController()

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('is-admin')
    navigate('/login')
  }
  const [visible, setVisible] = useState(true);

  const handleMouseEnter = () => {
    setVisible(true);
  };

  const handleMouseLeave = () => {
    if (parseInt(localStorage.getItem('selectedSidebarLinkIndex') as string) == 2){
      setVisible(false);
    }
  };
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
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            Kerbal
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
          <Menu>
            <MenuButton as={IconButton} icon={<IoIosSettings/>} bg='transparent'/>
            <MenuList>
              <MenuItem onClick={() => navigate('/account')}>Setting</MenuItem>
              {/*<MenuItem onClick={logout}>Log out</MenuItem>*/}
            </MenuList>
          </Menu>
        </HStack>
      </Container>
    </Box>
  )
}

export default Navbar
