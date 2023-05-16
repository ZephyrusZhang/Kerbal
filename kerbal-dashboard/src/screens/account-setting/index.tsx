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
import AccountEmail from './AccountEmail';
import AccountName from './AccountName';
import AccountPassword from './AccountPassword';

const AccountSetting = () => {
  return (
    <MainLayout
      display='flex'
      justifyContent='center'
    >
      <Tabs w='80%' orientation='vertical'>
        <TabList w='30%'>
          <Tab>Account Information</Tab>
          <Tab>Account Email</Tab>
          <Tab>Account Name</Tab>
          <Tab>Account Password</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AccountInformation/>
          </TabPanel>
          <TabPanel>
            <AccountEmail/>
          </TabPanel>
          <TabPanel>
            <AccountName/>
          </TabPanel>
          <TabPanel>
            <AccountPassword/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  )
}

export default AccountSetting;
