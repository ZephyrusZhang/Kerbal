import React, { useEffect, useState } from 'react';
import KerbalBox from "../../../components/containers/KerbalBox";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  CircularProgress,
  CircularProgressLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Spacer,
  Stack,
  StackDivider,
  Text,
  useDisclosure,
  VStack
} from "@chakra-ui/react";
import DomainStatusHead from "../../../components/DomainStatusHead";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlinePauseCircle,
  BsPlay, FaMemory,
  RiCpuLine, RiScreenshot2Fill, TiClipboard,
  VscDebugRestart, VscVm
} from "react-icons/all";
import request from "../../../util/request";
import { DomainProps, RamStatProp } from "../../../types";
import { responseToast, showToast, toast } from "../../../util/toast";
import { snapshotNameRegex } from "../../../const";
import { useNavigate } from "react-router-dom";
import { sendOperation } from "../../../util/domain";

interface Props {
  uuid: string
}

const DomainDashboard = ({uuid}: Props) => {
  const [domain, setDomain] = useState<DomainProps>({
    cpu_stat: 0,
    domain_id: 0,
    domain_uuid: '',
    port: 0,
    running_disk_id: '',
    spec: {
      cpu_count: 0,
      gpus: [],
      ram_size: 0
    },
    status: 'terminated',
    password: '',
    ram_stat: {used: 0, total: 1} as RamStatProp
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const {isOpen: isModalOpen, onOpen: onOpenModal, onClose: onCloseModal} = useDisclosure()
  const [snapshotName, setSnapshotName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const intervalId = setInterval(() => {
      request.get(
        `/api/cluster/domain/${uuid}`
      ).then((response) => {
        console.log(response)
        setDomain(response.data.result)
        setIsLoading(false)
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [uuid])

  const closeModal = () => {
    setSnapshotName('')
    onCloseModal()
  }

  const handleCreateSnapShot = () => {
    if (!snapshotNameRegex.test(snapshotName)) {
      toast({
        title: 'Invalid Snapshot Name',
        status: 'error',
        duration: 3000,
        isClosable: true
      })
      return
    }

    request.put(
      `/api/cluster/domain/${uuid}`,
      {
        domain_uuid: uuid,
        name: snapshotName
      }
    ).then(response => {
      console.log(response)
      responseToast(response.data.status, 'Snapshot Created Successfully', response.data.reason)
    })
    closeModal()
  }

  const handleCopySpiceAddress = (address: string) => {
    navigator.clipboard.writeText(address).then(() => {
      toast({
        title: 'Address Copied Successfully',
        status: 'success',
        duration: 2000,
        position: 'top',
        isClosable: true
      })
    })
  }

  const handleConnectToGui = () => {
    request.get(`/websock/connect?host=${domain.host_ipv4_addr}&port=${domain.port}`)
      .then(response => {
      if (response.data.status === 'ok') {
        console.log(response)
        navigate(`/remote?host=localhost&port=${response.data.result.port}&pwd=${domain.password}`)
      } else {
        showToast(`Fail to connect: ${response.data.reason}`, 'error')
      }
    })
  }

  return (
    <Skeleton isLoaded={!isLoading}>
      <HStack spacing={5} align='flex-start'>
        <KerbalBox as={VStack} minW='25vw' maxW='30vw' p='10px'>
          <DomainStatusHead w='80%' name={uuid} status={domain.status}/>
          <Card w='90%' bgColor='transparent'>
            <CardBody>
              <Stack divider={<StackDivider/>} spacing='4'>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    UUID
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {uuid}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    REMOTE VIEWER ADDRESS
                  </Heading>
                  <HStack mt='5'>
                    <Text fontSize='sm'>
                      spice://{domain?.host_ipv4_addr}:{domain?.port}
                    </Text>
                    <Spacer/>
                    <IconButton
                      aria-label='copy'
                      size='2xs'
                      variant='ghost'
                      icon={<TiClipboard/>}
                      onClick={() => handleCopySpiceAddress(`spice://${domain?.host_ipv4_addr}:${domain?.port}`)}
                    />
                  </HStack>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Remote Viewer Pwd
                  </Heading>
                  <HStack mt='5'>
                    <Text>
                      {showPassword ? domain.password : '*'.repeat(domain.password!.length)}
                    </Text>
                    <Spacer/>
                    <IconButton
                      aria-label='show'
                      size='2xs'
                      variant='ghost'
                      icon={showPassword ? <AiFillEyeInvisible/> : <AiFillEye/>}
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </HStack>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Image
                  </Heading>
                  <Text pt='2' fontSize='sm'>
                    {domain.image_name}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <Button
            w='80%'
            p='20px'
            leftIcon={<VscDebugRestart/>}
            colorScheme='green'
            onClick={() => sendOperation('reboot', domain.domain_uuid as string)}
          >
            Restart
          </Button>
        </KerbalBox>
        <VStack spacing={5}>
          <HStack spacing={5}>
            <Card>
              <CardHeader as={HStack}>
                <RiCpuLine size={25}/>
                <Text fontSize='2xl' as='b'>CPU Utility</Text>
              </CardHeader>
              <CardBody>
                <CircularProgress value={Math.floor(domain.cpu_stat as number * 100)} size='200px' thickness='6px'>
                  <CircularProgressLabel fontSize='3xl'>
                    {Math.floor(domain.cpu_stat as number * 100)}%
                  </CircularProgressLabel>
                </CircularProgress>
              </CardBody>
            </Card>
            <Card>
              <CardHeader as={HStack}>
                <FaMemory size={25}/>
                <Text fontSize='2xl' as='b'>Memory Utility</Text>
              </CardHeader>
              <CardBody>
                <CircularProgress
                  value={(domain.ram_stat.used / domain.ram_stat.total) as number * 100}
                  size='200px'
                  thickness='6px'
                >
                  <CircularProgressLabel fontSize='3xl'>
                    {Math.floor(domain.ram_stat.used / (1024 ** 2))}MB <br/>
                    Used
                  </CircularProgressLabel>
                </CircularProgress>
              </CardBody>
            </Card>
          </HStack>

          <Card w='full'>
            <CardBody>
              <Stack divider={<StackDivider/>}>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Snapshot
                  </Heading>
                  <Button
                    mt='3'
                    leftIcon={<RiScreenshot2Fill/>}
                    colorScheme='purple'
                    onClick={onOpenModal}
                  >
                    Take Snapshot
                  </Button>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Remote
                  </Heading>
                  <Button
                    mt='3'
                    leftIcon={<VscVm/>}
                    colorScheme='telegram'
                    onClick={handleConnectToGui}
                  >
                    Connect to GUI
                  </Button>
                </Box>
              </Stack>
            </CardBody>
          </Card>
        </VStack>
      </HStack>

      <Modal isOpen={isModalOpen} onClose={closeModal} isCentered>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Create New Snapshot</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <Input
              placeholder='Please input snapshot name'
              value={snapshotName}
              onChange={event => setSnapshotName(event.target.value)}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={closeModal}>
              Close
            </Button>
            <Button variant='ghost' onClick={handleCreateSnapShot}>Create</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Skeleton>
  )
}

export default DomainDashboard;
