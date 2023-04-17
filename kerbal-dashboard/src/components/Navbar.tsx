import React, { useEffect, useState } from 'react'
import { HStack, IconButton, useMediaQuery } from '@chakra-ui/react'
import { IoIosSettings, MdMenu } from 'react-icons/all'
import { useKerbalUIController } from "../context";

const Navbar = () => {
  const [navbarWidth, setNavbarWidth] = useState(window.innerWidth - 310)
  const {controller, dispatch} = useKerbalUIController()
  const [isSidebarExpanded] = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    const handleResize = () => {
      setNavbarWidth(window.innerWidth - 310)
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const handleToggleSidebar = () => {
    dispatch({...controller, isSidebarCollapse: !controller.isSidebarCollapse})
  }

  return (
    <HStack
      width={navbarWidth}
      left='310px'
      position='fixed'
      zIndex='100'
      justifyContent='flex-end'
      px='40px'
      py='20px'
      spacing={5}
      borderRadius='10px'
      css={{backdropFilter: 'blur(5px)'}}
    >
      {!isSidebarExpanded &&
        <IconButton
          icon={<MdMenu style={{fontSize: '20px'}}/>}
          bg='transparent'
          aria-label='Menu'
          onClick={handleToggleSidebar}
        />
      }
      <IconButton
        icon={<IoIosSettings style={{fontSize: '20px'}}/>}
        bg='transparent'
        aria-label='Setting'
      />
    </HStack>
  )
}

export default Navbar
