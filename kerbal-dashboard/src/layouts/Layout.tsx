import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Flex, useColorModeValue } from '@chakra-ui/react'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <Flex w='100vw' h='100vh' bg={useColorModeValue('#f0f1f4', '#202225')}>
      <Navbar/>
      <Outlet/>
    </Flex>
  )
}

export default Layout
