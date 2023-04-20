import React, { ReactNode } from 'react';
import { Box, ThemeTypings, useRadio, UseRadioProps } from "@chakra-ui/react";

interface Props extends UseRadioProps {
  children: ReactNode,
  colorScheme: ThemeTypings['colorSchemes']
}

const RadioCard = ({children, ...props}: Props) => {
  const { getInputProps, getCheckboxProps } = useRadio(props)
  const input = getInputProps()
  const checkbox = getCheckboxProps()

  return (
    <Box as='label'>
      <input {...input} />
      <Box
        {...checkbox}
        cursor='pointer'
        borderWidth='1px'
        borderRadius='md'
        boxShadow='md'
        _checked={{
          bg: `${props.colorScheme}`,
          color: 'white',
        }}
        px={5}
        py={3}
      >
        {children}
      </Box>
    </Box>
  )
}

export default RadioCard;
