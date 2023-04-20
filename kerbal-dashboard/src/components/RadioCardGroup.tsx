import React from 'react';
import { HStack, ThemeTypings, useRadioGroup, UseRadioGroupProps } from "@chakra-ui/react";
import RadioCard from "./RadioCard";

interface Props extends UseRadioGroupProps {
  options: string[],
  colorScheme: ThemeTypings['colorSchemes']
}

const RadioCardGroup = ({options,...props}: Props) => {
  const { getRootProps, getRadioProps } = useRadioGroup(props)
  const group = getRootProps()

  return (
    <HStack {...group}>
      {options.map((value) => {
        const radio = getRadioProps({ value })
        return (
          <RadioCard key={value} {...radio} colorScheme={props.colorScheme}>
            {value}
          </RadioCard>
        )
      })}
    </HStack>
  )
}

RadioCardGroup.defaultProps = {
  colorScheme: 'teal'
}

export default RadioCardGroup;
