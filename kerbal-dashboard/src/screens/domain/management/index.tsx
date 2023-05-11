import React from 'react';
import MainLayout from "../../../layouts/MainLayout";
import { useParams } from "react-router-dom";
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import {
  BsGearWideConnected,
  GoDashboard
} from "react-icons/all";
import DomainDashboard from "./DomainDashboard";
import DomainProperties from "../DomainProperties";

const DomainManagement = () => {
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
            <DomainDashboard uuid={domain_uuid as string}/>
          </TabPanel>
          <TabPanel>
            <DomainProperties uuid={domain_uuid as string}/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  )
}

export default DomainManagement;
