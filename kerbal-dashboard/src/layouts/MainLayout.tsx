import React from 'react';
import { Box, BoxProps } from "@chakra-ui/react";

const MainLayout = ({children, ...props}: BoxProps) => {
  return (
    <Box
      w='100vw'
      px='17vw'
      pt='5vh'
      mt='60px'
      {...props}
    >
      {children}
    </Box>
  )
}

export default MainLayout;
