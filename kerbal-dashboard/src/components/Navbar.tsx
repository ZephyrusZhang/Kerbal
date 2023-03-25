import React, { useEffect, useState } from 'react'
import { HStack, IconButton } from '@chakra-ui/react'
import { IoIosSettings, MdMenu } from 'react-icons/all'

const Navbar = () => {
  const [navbarWidth, setNavbarWidth] = useState(0)

  useEffect(() => {
    const handleResize = () => { setNavbarWidth(window.innerWidth - 310) }
    window.addEventListener('resize', handleResize)
    return () => { window.removeEventListener('resize', handleResize) }
  }, [])

  return (
    <HStack
      width={navbarWidth}
      left='310px'
      position='fixed'
      justifyContent='flex-end'
      px='40px'
      py='20px'
      spacing={5}
      css={{ backdropFilter: 'blur(10px)' }}
    >
      <IconButton icon={<MdMenu style={{ fontSize: '20px' }}/>} bg='transparent' aria-label='Menu'/>
      <IconButton icon={<IoIosSettings style={{ fontSize: '20px' }}/>} bg='transparent' aria-label='Setting'/>
    </HStack>
  )
}

export default Navbar
