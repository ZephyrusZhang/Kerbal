import React from 'react';
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
import { Box } from "@chakra-ui/react";

const Layout = () => {
  return (
    <Box display='flex'>
      <Navbar/>
      <Outlet/>
    </Box>
  );
};

export default Layout;
