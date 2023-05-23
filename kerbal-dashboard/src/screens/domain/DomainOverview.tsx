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
import request from "../../util/request";
import { AiOutlineDown, AiOutlineSearch, BsTrash, FiRefreshCw } from "react-icons/all";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import KerbalBox from "../../components/containers/KerbalBox";
import { DomainProps } from "../../types";

type RowProps = DomainProps & { showPassword: boolean }

const DomainOverview = () => {
  const [tableData, setTableData] = useState<Array<RowProps>>([])

  const navigate = useNavigate()

  useEffect(() => {
    request.get('/api/cluster/user/domains').then(response => {
      setTableData(response.data.result.map((item: RowProps) => ({...item, showPassword: false})))
    })
  }, [])

  const toggleShowPassword = (uuid: string) => {
    const updated = tableData.map(item => {
      if (item.domain_uuid === uuid) {
        return {...item, showPassword: !item.showPassword}
      }
      return item
    })
    setTableData(updated)
  }

  return (
    <MainLayout>
      <Flex>
        <Button colorScheme='messenger' mb='20px' onClick={() => navigate('/domain/create')}>Create</Button>
        <Spacer/>
        <IconButton colorScheme='gray' variant='ghost' aria-label='refresh' icon={<FiRefreshCw/>}/>
      </Flex>
      <KerbalBox p='50px'>
        <InputGroup pb='30px'>
          <Input/>
          <InputRightElement><AiOutlineSearch/></InputRightElement>
        </InputGroup>
        <TableContainer>
          <Table variant='simple'>
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Image</Th>
                <Th>Port</Th>
                <Th>Password</Th>
                <Th>Status</Th>
                <Th>Operation</Th>
              </Tr>
            </Thead>
            <Tbody>
              {tableData?.map((value, index) => (
                <Tr key={index}>
                  <Td>{value.domain_id}</Td>
                  <Td>{value.image_name}</Td>
                  <Td>{value.port}</Td>
                  <Td onClick={() => toggleShowPassword(value.domain_uuid as string)}>
                    {value.showPassword ? value.password : '*'.repeat(value.password!.length)}
                  </Td>
                  <Td>{value.status}</Td>
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
      </KerbalBox>
    </MainLayout>
  )
}

export default DomainOverview
