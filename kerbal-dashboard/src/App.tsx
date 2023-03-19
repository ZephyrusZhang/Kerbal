import * as React from "react"
import {
  ChakraProvider, theme,
} from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import SignIn from "./screens/SignIn";
import Layout from "./layouts/Layout";
import Dashboard from "./screens/Dashboard";
import SignUp from "./screens/SignUp";

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='dashboard' element={<Dashboard/>}/>
        </Route>
      </Routes>
    </ChakraProvider>
  )
}
