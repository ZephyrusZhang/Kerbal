import React from 'react'
import { Box, Container, Flex, Heading, HStack, IconButton } from '@chakra-ui/react'
import { IoIosSettings } from 'react-icons/all'
import ToggleColorModeButton from "./ToggleColorModeButton";

const Navbar = () => {
  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      css={{ backdropFilter: 'blur(10px)' }}
      zIndex={2}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={'tighter'}>
            Kerbal
          </Heading>
        </Flex>

        <HStack alignItems='right' spacing={5}>
          {/*{!isLargerThan768px &&*/}
          {/*  <IconButton*/}
          {/*    icon={<MdMenu style={{fontSize: '20px'}}/>}*/}
          {/*    bg='transparent'*/}
          {/*    aria-label='Menu'*/}
          {/*    onClick={handleToggleSidebar}*/}
          {/*  />*/}
          {/*}*/}
          <ToggleColorModeButton/>
          <IconButton
            icon={<IoIosSettings style={{fontSize: '20px'}}/>}
            bg='transparent'
            aria-label='Setting'
          />
        </HStack>
      </Container>
    </Box>
  )
}

export default Navbar
