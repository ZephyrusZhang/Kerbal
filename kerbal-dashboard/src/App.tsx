import * as React from 'react'
import {
  ChakraProvider, theme
} from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignIn from './screens/SignIn'
import Layout from './layouts/Layout'
import Dashboard from './screens/Dashboard'
import SignUp from './screens/SignUp'
import Test from './test/Test'
import PrivateRoute from "./routes/PrivateRoute";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/sign-in' element={<SignIn/>}/>
        <Route path='/sign-up' element={<SignUp/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='dashboard' element={<Dashboard/>}/>
            <Route path='/' element={<Navigate to='dashboard' replace/>}/>
          </Route>
        </Route>
      </Routes>
    </ChakraProvider>
  )
}
