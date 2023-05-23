import React, { useEffect, useRef, useState } from 'react'
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Button,
  Flex, HStack, IconButton, Input, InputGroup, InputRightElement,
  Spacer, Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr, useDisclosure
} from "@chakra-ui/react";
import request from "../../util/request";
import { AiOutlineSearch, FiRefreshCw } from "react-icons/all";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import KerbalBox from "../../components/containers/KerbalBox";
import { DomainProps } from "../../types";
import { DeleteIcon } from "@chakra-ui/icons";
import { responseToast } from "../../util/toast";
import { refresh } from "../../util/page";

type RowProps = DomainProps & { showPassword: boolean }

const DomainOverview = () => {
  const [tableData, setTableData] = useState<Array<RowProps>>([])
  const [domainUUIDToDelete, setDomainUUIDToDelete] = useState<string | null>(null)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    request.get('/api/cluster/user/domains').then(response => {
      console.log(response)
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

  const handleDeleteDomain = () => {
    request.delete(`/api/cluster/domain/${domainUUIDToDelete}`).then(response => {
      responseToast(response.data.status, 'Domain Destroy Successfully', response.data.reason)
    })
    setDomainUUIDToDelete(null)
    onClose()
    refresh()
  }

  return (
    <MainLayout>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              Delete Domain
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can&apos;t undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme='red' onClick={handleDeleteDomain} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

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
                    <HStack spacing='2'>
                      <Button colorScheme='whatsapp' size='xs'>Start</Button>
                      <Button colorScheme='orange' size='xs'>Stop</Button>
                      <IconButton
                        colorScheme='red'
                        aria-label='deleter'
                        icon={<DeleteIcon/>}
                        size='xs'
                        onClick={() => {
                          setDomainUUIDToDelete(value.domain_uuid as string)
                          onOpen()
                        }}
                      />
                    </HStack>
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
