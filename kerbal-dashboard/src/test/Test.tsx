import React from 'react';
import { Box } from "@chakra-ui/react";
import { motion } from "framer-motion";

const Test = () => {
  // @ts-ignore
  // @ts-ignore
  return (
    <Box
      w='100vw'
      h='100vh'
      display='flex'
      justifyContent='center'
      alignItems='center'
    >
      <Box
        as={motion.div}
        animate={{
          scale: [1, 2, 2, 1, 1],
          rotate: [0, 0, 270, 270, 0]
        }}
        // @ts-ignore
        transition={{
          duration: 3,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "loop",
        }}
        w='50vw'
        h='50vh'
        bgColor='cyan'
      />
    </Box>
  );
};

export default Test;
