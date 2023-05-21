import React, { ChangeEvent, useEffect, useState } from 'react';
import { Field, Form, Formik } from "formik";
import {
  Button,
  ButtonGroup,
  Flex,
  FormControl,
  FormLabel,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import SelectMenu from "../../components/SelectMenu";
import GpuSelectTable from "../../components/GpuSelectTable";
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
  const [formInitialValue, setFormInitialValue] = useState<FormProps>({
    cpu_count: 0,
    gpus: [],
    ram_size: 0,
    public_image_id: '',
    custom_image_id: '',
    node_id: ''
  });
  const [publicImageOption, setPublicImageOption] = useState([])
  const [customImageOption, setCustomImageOption] = useState([])
  const [nodeOption, setNodeOption] = useState([])
  const [nodes, setNodes] = useState<Array<NodeProps>>([])
  const [gpus, setGpus] = useState<Array<GpuProps & { isSelected?: boolean }>>([])
  const [tabIndex, setTabIndex] = useState(0)
  const navigate = useNavigate()
  const boxColor = useColorModeValue('#ffffff', '#414040')

  const handleSelectGpu = (gpu_id: string, isSelected: boolean) => {
    setGpus((prevState) => {
      return prevState.map(item => {
        if (item.gpu_id === gpu_id) {
          return {...item, isSelected: isSelected}
        }
        return item
      })
    })
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
      setNodes(response.data.result)
      setNodeOption(response.data.result
        .map((item: NodeProps) => ({value: item.node_id, text: item.node_id})))
    })
  }

  useEffect(() => {
    request.get('/api/cluster/storage/list').then(response => {
      const publicImages = response.data.result.filter((item: ImageProps) => item.dataset === 'base')
      const customImages = response.data.result.filter((item: ImageProps) => item.dataset === 'overlay')
      setPublicImageOption(publicImages
        .map((item: ImageProps) => ({value: item.id, text: item.name})))
      setFormInitialValue(prevState => ({
        ...prevState,
        public_image_id: publicImages[0] ? publicImages[0].id : '',
        custom_image_id: customImages[0] ? customImages[0].id : ''
      }))
      setCustomImageOption(customImages
        .map((item: ImageProps) => ({value: item.id, text: item.name})))
    })

    fetchNodes(formInitialValue)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (nodes[0]) {
      setGpus(nodes[0].gpus.map((item) => ({...item, isSelected: false})) as Array<never>)
    }
  }, [nodes])

  const handleSubmit = async (values: FormProps) => {
    const body = {
      cpu_count: values.cpu_count,
      ram_size: values.ram_size,
      gpus: gpus
        .filter(item => item.isSelected)
        .map(item => ({gpu_id: item.gpu_id})),
      image_id: tabIndex === 0 ? values.public_image_id : values.custom_image_id
    }
    console.log(body)
    request.post('/api/cluster/domain', body).then(response => {
      console.log(response)
    })
  }

  return (
    <MainLayout>
      <Formik initialValues={formInitialValue} onSubmit={handleSubmit} enableReinitialize>
        {({values, handleChange}) => {
          const handleChangeAndFetchNodes = (e: ChangeEvent<unknown>) => {
            handleChange(e)
            fetchNodes(values)
          }

          const handleNodeChange = (e: ChangeEvent<unknown>) => {
            handleChange(e)
            setGpus(nodes
              .find(item => item.node_id === values.node_id)!
              .gpus
              .map((item) => ({...item, isSelected: false})))
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
                      onChange={handleChangeAndFetchNodes}
                    />
                  </FormControl>
                  <FormControl display='flex'>
                    <FormLabel w='25%'>Memory</FormLabel>
                    <Field
                      as={SelectMenu}
                      name='ram_size'
                      defaultValue={0}
                      options={memoryOptions}
                      onChange={handleChangeAndFetchNodes}
                    />
                  </FormControl>
                  <FormControl display='flex'>
                    <FormLabel w='25%'>Nodes</FormLabel>
                    <Field
                      as={SelectMenu}
                      name='node_id'
                      defaultValue={0}
                      options={nodeOption}
                      onChange={handleNodeChange}
                    />
                  </FormControl>
                  <FormControl display='flex'>
                    <FormLabel w='25%'>GPU</FormLabel>
                    <GpuSelectTable
                      data={gpus}
                      onCheckGpu={handleSelectGpu}
                    />
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
