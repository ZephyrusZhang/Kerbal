import React from 'react';
import { Box, BoxProps, useColorModeValue } from "@chakra-ui/react";

const KerbalBox = (props: BoxProps) => {
  return (
    <Box
      borderRadius='10px'
      bgColor={useColorModeValue('white', '#2f3136')}
      {...props}
    >
      {props.children}
    </Box>
  )
}

export default KerbalBox;
