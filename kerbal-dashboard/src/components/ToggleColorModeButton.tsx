import React from 'react';
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import MotionBox from "./containers/MotionBox";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

const ToggleColorModeButton = () => {
  const {toggleColorMode} = useColorMode()

  return (
    <AnimatePresence initial={false}>
      <MotionBox
        style={{ display: 'inline-block' }}
        key={useColorModeValue('light', 'dark')}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 20, opacity: 0 }}
        // @ts-ignore
        transition={{ duration: 0.2 }}
      >
        <IconButton
          aria-label="Toggle theme"
          variant='ghost'
          icon={useColorModeValue(<SunIcon/>, <MoonIcon/>)}
          onClick={toggleColorMode}
        ></IconButton>
      </MotionBox>
    </AnimatePresence>
  )
}

export default ToggleColorModeButton;
