import React, { useEffect, useState } from 'react';
import { HStack, Spacer, StackProps, Text } from "@chakra-ui/react";
import CircleIcon from "./icons/CircleIcon";

interface Props extends StackProps {
  name: string,
  status: string
}

const DomainStatusHead = ({name, status, ...props}: Props) => {
  const [color, setColor] = useState('')

  useEffect(() => {
    switch (status) {
      case "booting":
        setColor('#efa73e')
        break
      case "running":
        setColor('#53a264')
        break
      case "terminating":
        setColor('#efa73e')
        break
      case "terminated":
        setColor('#c4573b')
        break
    }
  }, [status])


  return (
    <HStack {...props}>
      <CircleIcon color={color} border='1px' borderColor='white' borderRadius='full'/>
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
