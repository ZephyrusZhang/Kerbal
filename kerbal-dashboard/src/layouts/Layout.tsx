import React from 'react'
import { Outlet } from 'react-router-dom'
import { Flex, useColorModeValue } from '@chakra-ui/react'
import Navbar from '../components/Navbar'
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <Flex w='100vw' h='100vh' bg={useColorModeValue('#f0f1f4', '#202225')}>
      <Sidebar/>
      <Navbar/>
      <Outlet/>
    </Flex>
  )
}

export default Layout
