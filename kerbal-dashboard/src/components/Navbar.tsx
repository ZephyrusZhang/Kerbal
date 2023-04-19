import React from 'react'
import { HStack, IconButton, useColorMode, useMediaQuery } from '@chakra-ui/react'
import { CgSun, FiMoon, IoIosSettings, MdMenu } from 'react-icons/all'
import { useKerbalUIController } from "../context";

const Navbar = () => {
  const {controller, dispatch} = useKerbalUIController()

  const handleToggleSidebar = () => {
    dispatch({...controller, isSidebarCollapse: !controller.isSidebarCollapse})
  }

  const {colorMode, toggleColorMode} = useColorMode()
  const [isLargerThan768px] = useMediaQuery('(min-width: 768px)')

  return (
    <HStack
      width={controller.excludeSidebarWidth}
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
      {!isLargerThan768px &&
        <IconButton
          icon={<MdMenu style={{fontSize: '20px'}}/>}
          bg='transparent'
          aria-label='Menu'
          onClick={handleToggleSidebar}
        />
      }
      <IconButton
        icon={colorMode === 'light' ? <CgSun/> : <FiMoon/>}
        bg='transparent'
        aria-label='Color Mode'
        onClick={toggleColorMode}
      />
      <IconButton
        icon={<IoIosSettings style={{fontSize: '20px'}}/>}
        bg='transparent'
        aria-label='Setting'
      />
    </HStack>
  )
}

export default Navbar
