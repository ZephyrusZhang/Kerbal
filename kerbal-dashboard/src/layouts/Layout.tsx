import React from 'react';
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import { Flex } from "@chakra-ui/react";
import Navbar from "../components/Navbar";

const Layout = () => {
  return (
    <Flex>
      <Sidebar/>
      <Navbar/>
      <Outlet/>
    </Flex>
  );
};

export default Layout;
