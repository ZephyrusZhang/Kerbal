import React from 'react';
import { Select, SelectProps } from "@chakra-ui/react";

interface Props extends SelectProps {
  options: Array<{
    value: string,
    text: string
  }>,
  withNoneOption?: boolean
}

const SelectMenu = ({options, withNoneOption, ...props}: Props) => {
  return (
    <Select
      {...props}
    >
      {withNoneOption &&
      <option value={undefined}>None</option>}
      {options.map((value, index) => (
        <option value={value.value} key={index}>{value.text}</option>
      ))}
    </Select>
  )
}

export default SelectMenu;
