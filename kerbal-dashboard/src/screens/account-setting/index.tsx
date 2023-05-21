import React from 'react';
import {
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs
} from "@chakra-ui/react";
import MainLayout from "../../layouts/MainLayout";
import AccountProfile from "./AccountProfile";

const AccountSetting = () => {
  return (
    <MainLayout
      display='flex'
      justifyContent='center'
    >
      <Tabs w='80%' orientation='vertical'>
        <TabList w='30%'>
          <Tab>Profile</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <AccountProfile/>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </MainLayout>
  )
}

export default AccountSetting;
