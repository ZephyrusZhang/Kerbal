import React, { useState } from 'react';
import ContentLayout from "../layouts/ContentLayout";
import { Form, Formik } from "formik";
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
  Text, VStack
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/all";
import OSImageButton from "../components/OSImageButton";
import { useNavigate } from "react-router-dom";
import SelectMenu from "../components/SelectMenu";
import GpuSelectTable from "../components/GpuSelectTable";

type OSType = 'Ubuntu' | 'CentOS' | 'NixOS' | 'Debian' | 'Arch' | 'SUSE' | 'Fedora'

const ContainerCreation = () => {
  const osList: OSType[] = ['Ubuntu', 'CentOS', 'NixOS', 'Debian', 'Arch', 'SUSE', 'Fedora']
  const [whichOS, setWhichOS] = useState<string>()
  const navigate = useNavigate()

  return (
    <ContentLayout px='30px'>
      <Formik initialValues={{}} onSubmit={() => {console.log('submit')}}>
        {({
          errors,
          touched,
          handleSubmit,
          handleChange,
          isSubmitting
        }) => (
          <Form>
            <Flex>
              <Text >Image</Text>
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
                        templateRows="repeat(4, 1fr)"
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
                      <p>two!</p>
                    </TabPanel>
                    <TabPanel>
                      <p>three!</p>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </FormControl>
            </Flex>

            <Flex>
              <Text>Configuration</Text>
              <VStack w='80%'>
                <FormControl display='flex'>
                  <FormLabel>Number of cores</FormLabel>
                  <SelectMenu defaultValue={1} options={[
                    { value: '1', text: '1 vCPU' },
                    { value: '2', text: '2 vCPU' },
                    { value: '4', text: '4 vCPU' },
                    { value: '8', text: '8 vCPU' },
                    { value: '16', text: '16 vCPU' }
                  ]}/>
                </FormControl>
                <FormControl display='flex'>
                  <FormLabel>Memory</FormLabel>
                  <SelectMenu defaultValue={1} options={[
                    { value: '1', text: '1 GB' },
                    { value: '2', text: '2 GB' },
                    { value: '4', text: '4 GB' },
                    { value: '8', text: '8 GB' },
                  ]}/>
                </FormControl>
                <FormControl display='flex'>
                  <FormLabel>GPU</FormLabel>
                  <GpuSelectTable data={[
                    { name: 'RTX 3090 Ti', vram: 24 },
                    { name: 'RTX 2060', vram: 6 }
                  ]}/>
                </FormControl>
              </VStack>
            </Flex>

            <ButtonGroup spacing={5}>
              <Button colorScheme='green'>Create</Button>
              <Button onClick={() => navigate('/dashboard')}>Cancel</Button>
            </ButtonGroup>
          </Form>
        )}
      </Formik>
    </ContentLayout>
  )
}

export default ContainerCreation;
