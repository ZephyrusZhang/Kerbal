import React, { useEffect, useState } from 'react';
import KerbalBox from "../../../components/containers/KerbalBox";
import {
  Box,
  Button,
  Card,
  CardBody,
  CircularProgress, CircularProgressLabel,
  Heading,
  HStack, IconButton, Skeleton, Spacer,
  Stack,
  StackDivider,
  Text,
  VStack
} from "@chakra-ui/react";
import DomainStatusHead from "../../../components/DomainStatusHead";
import {
  AiFillEye,
  AiFillEyeInvisible,
  AiOutlinePauseCircle,
  BsPlay,
  RiCpuLine,
  VscDebugRestart
} from "react-icons/all";
import request from "../../../util/request";
import { DomainProps } from "../../../types";

interface Props {
  uuid: string
}

const DomainDashboard = ({uuid}: Props) => {
  const [domainProperties, setDomainProperties] = useState<DomainProps>({
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

  useEffect(() => {
    request.get(
      `/api/cluster/domain/${uuid}`
    ).then((response) => {
      setDomainProperties(response.data.result)
      setIsLoading(false)
    })
  }, [uuid])

  return (
    <Skeleton isLoaded={!isLoading}>
      <HStack spacing={5}>
        <KerbalBox as={VStack} minW='25vw' p='10px'>
          <DomainStatusHead w='80%' name={uuid} status={domainProperties.status}/>
          <Card w='90%' bgColor='transparent'>
            <CardBody>
              <Stack divider={<StackDivider />} spacing='4'>
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
                  <Text pt='2' fontSize='sm'>
                    spice://10.16.97.70:{domainProperties?.port}
                  </Text>
                </Box>
                <Box>
                  <Heading size='xs' textTransform='uppercase'>
                    Remote Viewer Pwd
                  </Heading>
                  <HStack pt='2'>
                    <Text>
                      {showPassword ? domainProperties.password : '*'.repeat(domainProperties.password!.length)}
                    </Text>
                    <Spacer/>
                    <IconButton
                      aria-label='show'
                      size='xs'
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
                    {domainProperties.image_name}
                  </Text>
                </Box>
              </Stack>
            </CardBody>
          </Card>
          <HStack spacing={5}>
            <Button w='50%' leftIcon={<BsPlay/>} colorScheme='whatsapp'>Start</Button>
            <Button w='50%' leftIcon={<VscDebugRestart/>} colorScheme='orange'>Restart</Button>
            <Button w='50%' leftIcon={<AiOutlinePauseCircle/>} colorScheme='red'>Stop</Button>
          </HStack>
        </KerbalBox>
        <KerbalBox display='flex' flexDirection='column' p='10px' alignItems='center'>
          <HStack w='20vw' pb='20px'>
            <RiCpuLine size={25}/>
            <Text fontSize='2xl' as='b'>CPU Utility</Text>
          </HStack>
          <CircularProgress value={40} size='200px' thickness='6px'>
            <CircularProgressLabel>40%</CircularProgressLabel>
          </CircularProgress>
        </KerbalBox>
        <KerbalBox display='flex' flexDirection='column' p='10px' alignItems='center'>
          <HStack w='20vw' pb='20px'>
            <RiCpuLine size={25}/>
            <Text fontSize='2xl' as='b'>Memory Utility</Text>
          </HStack>
          <CircularProgress value={25} size='200px' thickness='6px'>
            <CircularProgressLabel>1145MB</CircularProgressLabel>
          </CircularProgress>
        </KerbalBox>
      </HStack>
    </Skeleton>
  )
}

export default DomainDashboard;
