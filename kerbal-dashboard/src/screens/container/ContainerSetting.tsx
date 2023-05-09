import React from 'react';
import MainLayout from "../../layouts/MainLayout";
import { useParams } from "react-router-dom";
import {
  Button,
  CircularProgress,
  CircularProgressLabel,
  HStack, Spacer,
  Tab,
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

const ContainerSetting = () => {
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
              <KerbalBox minW='15vw' h='275px'>
                <VStack>
                  <HStack w='80%'>
                    <Text fontSize='3xl' as='b'>{domain_uuid}</Text>
                    <Spacer/>
                    <Text>status</Text>
                  </HStack>
                  <Button w='50%' leftIcon={<BsPlay/>} colorScheme='whatsapp'>Start</Button>
                  <Button w='50%' leftIcon={<VscDebugRestart/>} colorScheme='orange'>Restart</Button>
                  <Button w='50%' leftIcon={<AiOutlinePauseCircle/>} colorScheme='red'>Stop</Button>
                </VStack>
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

export default ContainerSetting;
