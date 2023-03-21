import React from 'react';
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";

const Layout = () => {
  return (
    <Flex>
      <Sidebar/>
      <Outlet/>
    </Flex>
  );
};

export default Layout;
