import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import { useParams } from "react-router-dom";
import {
  Box,
  Button, Card, CardBody, CardHeader,
  CircularProgress,
  CircularProgressLabel, Heading,
  HStack, Stack, StackDivider, Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs, Text, VStack
} from "@chakra-ui/react";
import {
  AiOutlinePauseCircle,
  BsGearWideConnected,
  BsPlay,
  GoDashboard,
  RiCpuLine,
  VscDebugRestart
} from "react-icons/all";
import KerbalBox from "../../components/containers/KerbalBox";
import DomainStatusHead from "../../components/DomainStatusHead";
import { useKerbalUIController } from "../../context";

const DomainSetting = () => {
  const {domain_uuid} = useParams()
  return (
    <MainLayout>
      <Tabs variant='enclosed'>
        <TabList>
          <Tab display='flex' flexDirection='column'><GoDashboard size={30}/>Dashboard</Tab>
          <Tab display='flex' flexDirection='column'><BsGearWideConnected size={30}/>Setting</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <HStack spacing={5}>
              <KerbalBox as={VStack} minW='25vw' p='10px'>
                <DomainStatusHead w='80%' name={domain_uuid as string} status='Running'/>
                <Card w='80%' bgColor='transparent'>
                  <CardBody>
                    <Stack divider={<StackDivider />} spacing='4'>
                      <Box>
                        <Heading size='xs' textTransform='uppercase'>
                          Name
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                          {domain_uuid}
                        </Text>
                      </Box>
                      <Box>
                        <Heading size='xs' textTransform='uppercase'>
                          IP
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                          11.4.51.4
                        </Text>
                      </Box>
                      <Box>
                        <Heading size='xs' textTransform='uppercase'>
                          Image
                        </Heading>
                        <Text pt='2' fontSize='sm'>
                          Ubuntu-clean
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
          </TabPanel>
          <TabPanel>
            <p>{domain_uuid} setting</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  )
}

export default DomainSetting;
