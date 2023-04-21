import React from 'react';
import { Select, SelectProps } from "@chakra-ui/react";

interface Props extends SelectProps {
  options: Array<{
    value: string,
    text: string
  }>
}

const SelectMenu = ({options, ...props}: Props) => {
  return (
    <Select
      {...props}
    >
      {options.map((value, index) => (
        <option value={value.value} key={index}>{value.text}</option>
      ))}
    </Select>
  )
}

export default SelectMenu;
