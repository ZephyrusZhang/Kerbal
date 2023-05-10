import React, { useEffect, useState } from 'react';
import { Box, HStack, Spacer, StackProps, Text } from "@chakra-ui/react";
import { DomainStatus } from "../types";

interface Props extends StackProps {
  name: string,
  status: DomainStatus
}

const DomainStatusHead = ({name, status, ...props}: Props) => {
  const [color, setColor] = useState('')

  useEffect(() => {
    switch (status) {
      case "Starting":
        setColor('#efa73e')
        break
      case "Running":
        setColor('#53a264')
        break
      case "Stopping":
        setColor('#efa73e')
        break
      case "Stopped":
        setColor('#c4573b')
        break
    }
  }, [status])


  return (
    <HStack {...props}>
      <Box w='15px' h='15px' backgroundColor={color} border='1px' borderColor='white' borderRadius='50%'/>
      <Text fontSize='3xl' as='b'>{name}</Text>
      <Spacer/>
      <Text
        border='2px'
        borderColor={color}
        borderRadius='5px'
        color={color}
        p='3px'
        fontSize='xs'
      >
        {status}
      </Text>
    </HStack>
  )
}

export default DomainStatusHead;
