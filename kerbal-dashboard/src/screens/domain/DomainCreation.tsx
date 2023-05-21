import React, { useEffect, useState, ChangeEvent } from 'react';
import { Field, Form, Formik } from "formik";
import {
  Button, ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text, useColorModeValue, VStack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SelectMenu from "../../components/SelectMenu";
import GpuSelectTable, { GpuInfo } from "../../components/GpuSelectTable";
import SelectedGpuTable from "../../components/SelectedGpuTable";
import MainLayout from "../../layouts/MainLayout";
import request from '../../util/request';
import { GpuProps, ImageProps, NodeProps } from "../../types";
import { cpuOptions, memoryOptions } from "../../const";

interface FormProps {
  cpu_count: number,
  gpus: Array<GpuProps>,
  ram_size: number,
  public_image_id: string,
  custom_image_id: string,
  node_id: string
}

const DomainCreation = () => {
  const formInitValue: FormProps = {
    cpu_count: 0,
    gpus: [],
    ram_size: 0,
    public_image_id: '',
    custom_image_id: '',
    node_id: ''
  }
  const [selectedGpu, setSelectedGpu] = useState<GpuInfo[]>([])
  const [publicImageOption, setPublicImageOption] = useState([])
  const [customImageOption, setCustomImageOption] = useState([])
  const [nodeOption, setNodeOption] = useState([])
  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate()
  const boxColor = useColorModeValue('#ffffff', '#414040')

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

  const handleSubmit = async (values: FormProps) => {

  }

  const fetchNodes = (values: FormProps) => {
    request.get(
      '/api/cluster', {
        params: {
          'cpu_count': values.cpu_count,
          'gpu[name]': '',
          'gpu[vram_size]': 0,
          'gpu_count': 0,
          'ram_size': values.ram_size
        }
      }
    ).then(response => {
      setNodeOption(response.data.result
        .map((item: NodeProps) => ({value: item.node_id, text: item.node_id})))
    })
  }

  useEffect(() => {
    request.get('/api/cluster/storage/list').then(response => {
      setPublicImageOption(response.data.result
        .filter((item: ImageProps) => item.dataset === 'base')
        .map((item: ImageProps) => ({value: item.id, text: item.name})))
      setCustomImageOption(response.data.result
        .filter((item: ImageProps) => item.dataset === 'overlay')
        .map((item: ImageProps) => ({value: item.id, text: item.name})))
    })

    fetchNodes(formInitValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <MainLayout>
      <Formik initialValues={formInitValue} onSubmit={handleSubmit}>
        {({values, handleChange}) => {
          const handleFormChange = (e: ChangeEvent<unknown>) => {
            handleChange(e)
            fetchNodes(values)
          }

          return (
            <Form>
              <Flex w='90%' bg={boxColor} p='10px' borderRadius='5px'>
                <Text w='25%' as='b' align='center'>Image</Text>
                <FormControl>
                  <Tabs w='80%' onChange={setTabIndex}>
                    <TabList>
                      <Tab>Public Image</Tab>
                      <Tab>Custom Image</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        <FormControl>
                          <Field as={SelectMenu} name='public_image_id' options={publicImageOption}/>
                        </FormControl>
                      </TabPanel>
                      <TabPanel>
                        <FormControl>
                          <Field as={SelectMenu} name='custom_image_id' options={customImageOption}/>
                        </FormControl>
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
                    <Field
                      as={SelectMenu}
                      name='cpu_count'
                      defaultValue={0}
                      options={cpuOptions}
                      onChange={handleFormChange}
                    />
                  </FormControl>
                  <FormControl display='flex'>
                    <FormLabel w='25%'>Memory</FormLabel>
                    <Field
                      as={SelectMenu}
                      name='ram_size'
                      defaultValue={0}
                      options={memoryOptions}
                      onChange={handleFormChange}
                    />
                  </FormControl>
                  <FormControl display='flex'>
                    <FormLabel w='25%'>Nodes</FormLabel>
                    <Field
                      as={SelectMenu}
                      name='node_id'
                      defaultValue={0}
                      options={nodeOption}
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormControl display='flex'>
                    <FormLabel w='25%'>GPU</FormLabel>
                    <VStack w='80%'>
                      <SelectedGpuTable data={selectedGpu} onDeleteGpu={handleDeleteGpu}/>
                      <GpuSelectTable
                        data={[
                          {name: 'RTX 3090 Ti', vram: 24},
                          {name: 'RTX 4090 Ti', vram: 32},
                          {name: 'RTX 2060', vram: 6}
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
          )
        }}
      </Formik>
    </MainLayout>
  )
}

export default DomainCreation;
