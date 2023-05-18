import React, { useState } from 'react';
import { Field, Form, Formik } from "formik";
import {
  Button, ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Grid, Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text, useColorModeValue, VStack
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/all";
import OSImageButton from "../../components/OSImageButton";
import { useNavigate } from "react-router-dom";
import SelectMenu from "../../components/SelectMenu";
import GpuSelectTable, { GpuInfo } from "../../components/GpuSelectTable";
import SelectedGpuTable from "../../components/SelectedGpuTable";
import MainLayout from "../../layouts/MainLayout";
import request from '../../util/request';
import { GpuProps } from "../../types";

type OSType = 'Ubuntu' | 'CentOS' | 'NixOS' | 'Debian' | 'Arch' | 'SUSE' | 'Fedora'

interface FormProps {
  cpu_count: number,
  gpus: Array<GpuProps>,
  ram_size: number
}

const DomainCreation = () => {
  const osList: OSType[] = ['Ubuntu', 'CentOS', 'NixOS', 'Debian', 'Arch', 'SUSE', 'Fedora']
  const [whichOS, setWhichOS] = useState<string>()
  const [selectedGpu, setSelectedGpu] = useState<GpuInfo[]>([])
  const navigate = useNavigate()
  const cpuOptions = [
    { value: 1, text: '1 vCPU' },
    { value: 2, text: '2 vCPU' },
    { value: 4, text: '4 vCPU' },
    { value: 8, text: '8 vCPU' },
    { value: 16, text: '16 vCPU' }
  ]
  const memoryOptions = [
    { value: 1, text: '1 GB' },
    { value: 2, text: '2 GB' },
    { value: 4, text: '4 GB' },
    { value: 8, text: '8 GB' },
  ]

  const handleAddGpu = (gpu: GpuInfo) => {
    const index = selectedGpu.findIndex(item => item.name === gpu.name)
    if (index < 0) {
      setSelectedGpu([...selectedGpu, {...gpu, count: 1}])
    } else {
      const temp = [...selectedGpu]
      temp[index].count = temp[index].count as number + 1
      setSelectedGpu(temp)
    }
  }

  const handleDeleteGpu = (gpu: GpuInfo) => {
    const index = selectedGpu.findIndex(item => item.name === gpu.name)
    const temp = [...selectedGpu]
    temp[index].count = temp[index].count as number - 1
    setSelectedGpu(temp.filter(item => item.count as number > 0))
  }

  const boxColor = useColorModeValue('#ffffff', '#414040')

  const handleSubmit = async (values: FormProps) => {
    // console.log(JSON.stringify({...values, ram_size: values.ram_size * 1024}))
    request.post(
      '/api/cluster/domain',
      JSON.stringify({...values, ram_size: values.ram_size * 1024}),
      {withCredentials: true}
    ).then()
  }

  const formInitValue: FormProps = {
    cpu_count: 1,
    gpus: [],
    ram_size: 16 * 1024
  }

  return (
    <MainLayout>
      <Formik initialValues={formInitValue} onSubmit={handleSubmit}>
        {() => (
          <Form>
            <Flex w='90%' bg={boxColor} p='10px' borderRadius='5px'>
              <Text w='25%' as='b' align='center'>Image</Text>
              <FormControl>
                <Tabs w='80%'>
                  <TabList>
                    <Tab>Public Image</Tab>
                    <Tab>Custom Image</Tab>
                    <Tab>Image Market <FiShoppingCart/></Tab>
                  </TabList>

                  <TabPanels>
                    <TabPanel>
                      <Grid
                        templateColumns={{ base: "repeat(3, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(6, 1fr)" }}
                        gap={4}
                      >
                        {osList.map((os, index) => (
                          <OSImageButton
                            key={index}
                            os={os}
                            isActive={whichOS === os}
                            onClick={() => setWhichOS(os)}
                          />
                        ))}
                      </Grid>
                    </TabPanel>
                    <TabPanel>
                      <p>custom image</p>
                    </TabPanel>
                    <TabPanel>
                      <p>image market</p>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </FormControl>
            </Flex>

            <Flex w='90%' bg={boxColor} mt='20px' p='10px' borderRadius='5px'>
              <Text w='20%' as='b' align='center'>Configuration</Text>
              <VStack w='80%'>
                <FormControl display='flex'>
                  <FormLabel w='25%'>Number of cores</FormLabel>
                  <Field as={SelectMenu} name='cpu_count' defaultValue={1} options={cpuOptions}/>
                </FormControl>
                <FormControl display='flex'>
                  <FormLabel w='25%'>Memory</FormLabel>
                  <Field as={SelectMenu} name='ram_size' defaultValue={1} options={memoryOptions}/>
                </FormControl>
                <FormControl display='flex'>
                  <FormLabel w='25%'>GPU</FormLabel>
                  <VStack w='80%'>
                    <SelectedGpuTable data={selectedGpu} onDeleteGpu={handleDeleteGpu}/>
                    <GpuSelectTable
                      data={[
                      { name: 'RTX 3090 Ti', vram: 24 },
                      { name: 'RTX 4090 Ti', vram: 32 },
                      { name: 'RTX 2060', vram: 6 }
                    ]}
                      onAddGpu={handleAddGpu}
                    />
                  </VStack>
                </FormControl>
              </VStack>
            </Flex>

            <ButtonGroup mt='20px' spacing={5}>
              <Button type='submit' colorScheme='green'>Create</Button>
              <Button onClick={() => navigate('/domain')}>Cancel</Button>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </MainLayout>
  )
}

export default DomainCreation;
