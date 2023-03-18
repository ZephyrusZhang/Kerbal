import * as React from "react"
import {
  ChakraProvider, theme,
} from "@chakra-ui/react"
import { Route, Routes } from "react-router-dom";
import SignIn from "./screens/SignIn";
import Layout from "./Layout";
import Dashboard from "./screens/Dashboard";

export const App = () => {

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='dashboard' element={<Dashboard/>}/>
        </Route>
      </Routes>
    </ChakraProvider>
  )
}
