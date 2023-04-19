import React from 'react';
import { Button, ButtonProps, Image } from "@chakra-ui/react";

interface Props extends ButtonProps {
  os: 'Ubuntu' | 'CentOS' | 'NixOS' | 'Debian' | 'Arch' | 'SUSE' | 'Fedora',
}

const OSImageButton = ({os, ...props}: Props) => {
  return (
    <Button
      {...props}
      w='auto'
      h='auto'
      p='2px'
      display='flex'
      flexDirection='column'
      variant='outline'
    >
      <Image boxSize='30px' objectFit='cover' src={require(`../assets/images/os/${os}.png`)}/>
      {os}
    </Button>
  )
}

export default OSImageButton
