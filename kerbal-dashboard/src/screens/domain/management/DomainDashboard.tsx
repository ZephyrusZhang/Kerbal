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
import { DomainProps } from "../../../types";
import { responseToast, toast } from "../../../util/toast";
import { snapshotNameRegex } from "../../../const";
import { useNavigate } from "react-router-dom";

interface Props {
  uuid: string
}

const DomainDashboard = ({uuid}: Props) => {
  const [domain, setDomain] = useState<DomainProps>({
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
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const {isOpen: isModalOpen, onOpen: onOpenModal, onClose: onCloseModal} = useDisclosure()
  const [snapshotName, setSnapshotName] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    request.get(
      `/api/cluster/domain/${uuid}`
    ).then((response) => {
      setDomain(response.data.result)
      setIsLoading(false)
    })
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
                      spice://10.16.97.70:{domain?.port}
                    </Text>
                    <Spacer/>
                    <IconButton
                      aria-label='copy'
                      size='2xs'
                      variant='ghost'
                      icon={<TiClipboard/>}
                      onClick={() => handleCopySpiceAddress(`spice://10.16.97.70:${domain?.port}`)}
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
          <HStack spacing={5} pb='20px'>
            <Button w='50%' leftIcon={<BsPlay/>} colorScheme='whatsapp'>Start</Button>
            <Button w='50%' leftIcon={<VscDebugRestart/>} colorScheme='orange'>Restart</Button>
            <Button w='50%' leftIcon={<AiOutlinePauseCircle/>} colorScheme='red'>Stop</Button>
          </HStack>
        </KerbalBox>
        <VStack spacing={5}>
          <HStack spacing={5}>
            <Card>
              <CardHeader as={HStack}>
                <RiCpuLine size={25}/>
                <Text fontSize='2xl' as='b'>CPU Utility</Text>
              </CardHeader>
              <CardBody>
                <CircularProgress value={40} size='200px' thickness='6px'>
                  <CircularProgressLabel>40%</CircularProgressLabel>
                </CircularProgress>
              </CardBody>
            </Card>
            <Card>
              <CardHeader as={HStack}>
                <FaMemory size={25}/>
                <Text fontSize='2xl' as='b'>Memory Utility</Text>
              </CardHeader>
              <CardBody>
                <CircularProgress value={25} size='200px' thickness='6px'>
                  <CircularProgressLabel>1145MB</CircularProgressLabel>
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
                    onClick={() => navigate(`/remote?host=localhost&port=${domain.port}&pwd=${domain.password}`)}
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
