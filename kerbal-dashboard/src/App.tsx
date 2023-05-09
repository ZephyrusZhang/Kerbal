import * as React from 'react'
import {
  ChakraProvider, theme
} from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AccountLogin from './screens/AccountLogin'
import Layout from './layouts/Layout'
import Dashboard from './screens/Dashboard'
import AccountCreation from './screens/AccountCreation'
import Test from './test/Test'
import PrivateRoute from "./routes/PrivateRoute";
import ContainerCreation from "./screens/ContainerCreation";
import UserEdit from './screens/UserEdit'
import AccountSetting from "./screens/account-setting";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/login' element={<AccountLogin/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/user_edit' element={<UserEdit/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='/dashboard' element={<Dashboard/>}/>
            <Route path='/dashboard/create' element={<ContainerCreation/>}/>
            <Route path='/account/creation' element={<AccountCreation/>}/>
            <Route path='account' element={<AccountSetting/>}/>
            <Route path='/' element={<Navigate to='dashboard' replace/>}/>
          </Route>
        </Route>
      </Routes>
    </ChakraProvider>
  )
}
