import React, { useState } from 'react';
import ContentLayout from "../layouts/ContentLayout";
import { Form, Formik } from "formik";
import {
  Flex,
  FormControl,
  FormLabel,
  Grid, HStack, Radio, RadioGroup, Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text, VStack
} from "@chakra-ui/react";
import { FiShoppingCart } from "react-icons/all";
import OSImageButton from "../components/OSImageButton";

type OSType = 'Ubuntu' | 'CentOS' | 'NixOS' | 'Debian' | 'Arch' | 'SUSE' | 'Fedora'

const ContainerCreation = () => {
  const osList: OSType[] = ['Ubuntu', 'CentOS', 'NixOS', 'Debian', 'Arch', 'SUSE', 'Fedora']
  const [whichOS, setWhichOS] = useState<string>()

  const cpuCoreNumOptions = [1, 2, 4, 8, 16]

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
              <VStack>
                <FormControl display='flex'>
                  <FormLabel>Number of cores (vCPUs)</FormLabel>
                  <RadioGroup defaultValue='1'>
                    <HStack>
                      {cpuCoreNumOptions.map((value) => (
                        <Radio key={value} value={`${value}`}>{value}</Radio>
                      ))}
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </VStack>
            </Flex>
          </Form>
        )}
      </Formik>
    </ContentLayout>
  )
}

export default ContainerCreation;
