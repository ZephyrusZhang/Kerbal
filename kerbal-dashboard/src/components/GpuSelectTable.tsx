import React, { useState } from 'react';
import { IconButton, Table, TableProps, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

export type GpuInfo = {
  name: string,
  vram: number
}

interface Props extends TableProps {
  data: GpuInfo[]
}

const GPUSelectTable = ({data, ...props}: Props) => {
  const [sortOrder, setSortOrder] = useState<'sequence' | 'reverse'>('reverse');

  const handleClickSort = () => {
    if (sortOrder == 'sequence') {
      data.sort((a, b) => a.vram - b.vram)
      setSortOrder('reverse')
    } else {
      data.sort((a, b) => b.vram - a.vram)
      setSortOrder('sequence')
    }
  }

  return (
    <Table {...props}>
      <Thead>
        <Tr>
          <Th>Name</Th>
          <Th>
            VRAM(GB)
            {sortOrder === 'sequence' ?
              <IconButton
                aria-label='sequence'
                borderRadius='full'
                variant='link'
                onClick={handleClickSort}
                icon={<ArrowDownIcon/>}
              /> :
              <IconButton
                aria-label='reverse'
                borderRadius='full'
                variant='link'
                onClick={handleClickSort}
                icon={<ArrowUpIcon/>}
              />}
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {data.map((item, index) => (
          <Tr key={index}>
            <Td>{item.name}</Td>
            <Td>{item.vram}</Td>
            <Td>
              <IconButton
                borderRadius='full'
                size='xs'
                aria-label={'Add GPU'}
                icon={<AddIcon/>}
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  )
}

export default GPUSelectTable;
