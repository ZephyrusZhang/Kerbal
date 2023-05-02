import React, { useEffect, useState } from 'react'
import {
  Button,
  Flex, IconButton, Input, InputGroup, InputRightElement,
  Menu,
  MenuButton, MenuItem,
  MenuList, Spacer, Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import request from "../util/request";
import { AiOutlineDown, AiOutlineSearch, BsTrash, FiRefreshCw } from "react-icons/all";
import { useNavigate } from "react-router-dom";
import MainLayout from "../layouts/MainLayout";

interface TableProps {
  username?: string,
  name: string,
  state: 'Running' | 'Stopping' | 'Stopped' | 'Starting',
  ip: string,
  image: string,
  specification: string
}

const DashBoard = () => {
  const [tableData, setTableData] = useState<TableProps[]>([
    { "username": "zephyrus", "name": "test_instance", "state": "Running", "ip":  "11.45.14.00", "image": "PyTorch-2.0", "specification": "Intel-i7 RTX-2060" },
    { "username": "zephyrus", "name": "demo", "state": "Stopped", "ip":  "19.19.81.00","image": "ubuntu-clean", "specification": "Intel-i5 RTX-2060" },
    { "username": "zephyrus", "name": "jeb", "state": "Stopping", "ip":  "1.1.1.1","image": "debian-clean", "specification": "Intel-i7 RTX-3090" },
    { "username": "zephyrus", "name": "cs", "state": "Starting", "ip":  "114.114.114.114","image": "arch-clean", "specification": "Intel-i5 RTX-2060" }
  ])

  const navigate = useNavigate()

  // useEffect(() => {
  //   console.log(tableData)
  //   request.get<TableProps[]>('/api', {
  //     headers: { 'cache-control': 'no-cache' },
  //     params: { 'username': 'zephyrus' }
  //   }).then(response => setTableData(response.data))
  //   console.log(tableData)
  // }, [])


  return (
    <MainLayout>
      <Flex>
        <Button colorScheme='messenger' mb='20px' onClick={() => navigate('/dashboard/create')}>Create</Button>
        <Spacer/>
        <IconButton colorScheme='gray' variant='ghost' aria-label='refresh' icon={<FiRefreshCw/>}/>
      </Flex>
      <InputGroup>
        <Input/>
        <InputRightElement><AiOutlineSearch/></InputRightElement>
      </InputGroup>
      <TableContainer>
        <Table variant='simple'>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>State</Th>
              <Th>IP</Th>
              <Th>Image</Th>
              <Th>Specification</Th>
              <Th>Operation</Th>
            </Tr>
          </Thead>
          <Tbody>
            {tableData?.map(item => (
              <Tr key={item.name}>
                <Td>{item.name}</Td>
                <Td>{item.state}</Td>
                <Td>{item.ip}</Td>
                <Td>{item.image}</Td>
                <Td>{item.specification}</Td>
                <Td>
                  <Stack direction='row' spacing='2'>
                    <Button colorScheme='whatsapp' size='xs'>Start</Button>
                    <Button colorScheme='orange' size='xs'>Stop</Button>
                    <Menu>
                      <MenuButton size='xs' as={IconButton} icon={<AiOutlineDown/>}/>
                      <MenuList>
                        <MenuItem icon={<BsTrash/>}>Delete</MenuItem>
                      </MenuList>
                    </Menu>
                  </Stack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </MainLayout>
  )
}

export default DashBoard
