import React from 'react';
import { IconButton, Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { GpuInfo } from "./GpuSelectTable";
import { MinusIcon } from "@chakra-ui/icons";

interface Props extends TableProps {
  data: GpuInfo[],
  onDeleteGpu: (gpu: GpuInfo) => void
}

const SelectedGpuTable = ({data, onDeleteGpu, ...props}: Props) => {
  return (
    <Table {...props}>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>VRAM(GB)</Th>
          <Th>Count</Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) => (
          <Tr key={index}>
            <Td>{item.name}</Td>
            <Td>{item.vram}</Td>
            <Td>{item.count}</Td>
            <Td>
              <IconButton
                borderRadius='full'
                size='xs'
                aria-label={'Add GPU'}
                icon={<MinusIcon/>}
                onClick={() => onDeleteGpu(item)}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default SelectedGpuTable;
