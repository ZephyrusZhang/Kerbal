import React from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import MainLayout from "../../layouts/MainLayout";
import AccountInformation from "./AccountInformation";

const AccountSetting = () => {
  return (
    <MainLayout
      display='flex'
      justifyContent='center'
    >
      <Tabs w='80%' orientation='vertical'>
        <TabList w='30%'>
          <Tab>Account Information</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AccountInformation/>
          </TabPanel>
          <TabPanel>
            <p>two!</p>
          </TabPanel>
          <TabPanel>
            <p>three!</p>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  )
}

export default AccountSetting;
