import React, { useEffect, useRef, useState } from 'react'
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Button,
  Flex, HStack, IconButton, Input, InputGroup, InputRightElement, Link, Skeleton,
  Spacer, Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr, useDisclosure
} from "@chakra-ui/react";
import request from "../../util/request";
import { AiFillEye, AiFillEyeInvisible, AiOutlineSearch, FiRefreshCw } from "react-icons/all";
import { useNavigate, Link as ReachLink } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";
import KerbalBox from "../../components/containers/KerbalBox";
import { DomainProps } from "../../types";
import { DeleteIcon } from "@chakra-ui/icons";
import { responseToast } from "../../util/toast";
import { refresh } from "../../util/page";
import { sendOperation } from "../../util/domain";

type RowProps = DomainProps & { showPassword: boolean }

const DomainOverview = () => {
  const [domains, setDomains] = useState<Array<RowProps>>([])
  const [isLoading, setIsLoading] = useState(true)
  const [domainUUIDToDelete, setDomainUUIDToDelete] = useState<string | null>(null)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const cancelRef = useRef<HTMLButtonElement>(null)
  const navigate = useNavigate()

  const fetchData = () => {
    request.get('/api/cluster/user/domains').then(response => {
      console.log(response)
      setDomains(response.data.result.map((item: RowProps) => ({...item, showPassword: false})))
      setIsLoading(false)
    })
  }

  useEffect(() => {
    fetchData()
  }, [])

  const toggleShowPassword = (uuid: string) => {
    const updated = domains.map(item => {
      if (item.domain_uuid === uuid) {
        return {...item, showPassword: !item.showPassword}
      }
      return item
    })
    setDomains(updated)
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
        <IconButton
          colorScheme='gray'
          variant='ghost'
          aria-label='refresh'
          icon={<FiRefreshCw/>}
          onClick={fetchData}
        />
      </Flex>
      <Skeleton isLoaded={!isLoading}>
        <KerbalBox p='50px'>
          {domains.length === 0 ?
            <Text fontSize='4xl'>No Domains Been Created</Text> :
            <>
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
                      <Th>IP</Th>
                      <Th>Password</Th>
                      <Th>Status</Th>
                      <Th>Operation</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {domains?.map((value, index) => (
                      <Tr key={index}>
                        <Td>
                          <Link
                            as={ReachLink}
                            color='cyan.700'
                            to={`/domain/management/${value.domain_uuid}`}
                          >
                            {value.domain_id}
                          </Link>
                        </Td>
                        <Td>{value.image_name}</Td>
                        <Td>{value.host_ipv4_addr}:{value.port}</Td>
                        <Td>
                          <HStack>
                            <Text>
                              {value.showPassword ? value.password : '*'.repeat(value.password!.length)}
                            </Text>
                            <IconButton
                              aria-label='show'
                              size='xs'
                              variant='ghost'
                              icon={value.showPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                              onClick={() => toggleShowPassword(value.domain_uuid as string)}
                            />
                          </HStack>
                        </Td>
                        <Td>{value.status}</Td>
                        <Td>
                          <HStack spacing='2'>
                            <Button
                              colorScheme='green'
                              size='xs'
                              onClick={() => sendOperation('reboot', value.domain_uuid as string)}
                            >
                              Restart
                            </Button>
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
            </>}
        </KerbalBox>
      </Skeleton>
    </MainLayout>
  )
}

export default DomainOverview
