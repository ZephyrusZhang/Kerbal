import React from 'react'
import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import Navbar from '../components/Navbar'

const Layout = () => {
  return (
    <Flex>
      {/*<Sidebar/>*/}
      <Navbar/>
      <Outlet/>
    </Flex>
  )
}

export default Layout
