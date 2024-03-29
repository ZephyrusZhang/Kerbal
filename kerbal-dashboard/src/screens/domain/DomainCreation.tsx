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
import { responseToast } from "../../util/toast";

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
  const [imageTabIndex, setImageTabIndex] = useState(0)
  const [domainTypeTabIndex, setDomainTypeTabIndex] = useState(0)
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
      setFormInitialValue({...values, node_id: response.data.result[0].node_id})
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
      setCustomImageOption(customImages
        .map((item: ImageProps) => ({value: item.id, text: item.name})))
      setFormInitialValue(prevState => {
        const updateValue = {
          ...prevState,
          public_image_id: publicImages[0] ? publicImages[0].id : '',
          custom_image_id: customImages[0] ? customImages[0].id : ''
        }
        fetchNodes(updateValue)
        return updateValue
      })
    })
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
      image_id: imageTabIndex === 0 ? values.public_image_id : values.custom_image_id,
      node_id: values.node_id
    }
    console.log(body)
    request.post('/api/cluster/domain', body).then(response => {
      console.log(response)
      responseToast(response.data.status, 'Domain Created Successfully', response.data.reason)
      setTimeout(() => navigate('/'), 2000)
    })
  }

  return (
    <MainLayout>
      <Formik initialValues={formInitialValue} onSubmit={handleSubmit} enableReinitialize>
        {({values, handleChange}) => {
          const handleChangeAndFetchNodes = (e: ChangeEvent<HTMLInputElement>) => {
            handleChange(e)
            fetchNodes(values)
          }

          const handleNodeChange = (e: ChangeEvent<HTMLInputElement>) => {
            handleChange(e)
            setGpus(nodes
              .find(item => item.node_id === e.target.value)!
              .gpus
              .map((item) => ({...item, isSelected: false})))
          }

          return (
            <Form>
              <Flex w='90%' bg={boxColor} p='10px' borderRadius='5px'>
                <Text w='25%' mt='10px' as='b' align='center'>Image</Text>
                <FormControl>
                  <Tabs w='80%' onChange={setImageTabIndex}>
                    <TabList>
                      <Tab>Public Image</Tab>
                      <Tab>Custom Image</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        <FormControl>
                          <Field
                            as={SelectMenu}
                            name='public_image_id'
                            options={publicImageOption}
                            onChange={handleChangeAndFetchNodes}
                          />
                        </FormControl>
                      </TabPanel>
                      <TabPanel>
                        <FormControl>
                          <Field
                            as={SelectMenu}
                            name='custom_image_id'
                            options={customImageOption}
                            onChange={handleChangeAndFetchNodes}
                          />
                        </FormControl>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </FormControl>
              </Flex>

              <Flex w='90%' bg={boxColor} mt='20px' p='10px' borderRadius='5px'>
                <Text w='20%' as='b' mt='10px' align='center'>Configuration</Text>
                <VStack w='80%' align='flex-start'>
                  <Tabs onChange={setDomainTypeTabIndex}>
                    <TabList>
                      <Tab>CPU</Tab>
                      <Tab>GPU</Tab>
                    </TabList>
                  </Tabs>

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
                      options={nodeOption}
                      onChange={handleNodeChange}
                    />
                  </FormControl>
                  {domainTypeTabIndex == 1 &&
                    <FormControl display='flex'>
                      <FormLabel w='25%'>GPU</FormLabel>
                      <GpuSelectTable
                        data={gpus}
                        onCheckGpu={handleSelectGpu}
                      />
                    </FormControl>}
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
