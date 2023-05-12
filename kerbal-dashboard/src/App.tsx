import * as React from 'react'
import {
  ChakraProvider, theme
} from '@chakra-ui/react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AccountLogin from './screens/AccountLogin'
import Layout from './layouts/Layout'
import AccountCreation from './screens/AccountCreation'
import Test from './test/Test'
import PrivateRoute from "./routes/PrivateRoute";
import DomainCreation from "./screens/domain/DomainCreation";
import UserEdit from './screens/UserEdit'
import AccountSetting from "./screens/account-setting";
import DomainOverview from "./screens/domain/DomainOverview";
import DomainManagement from "./screens/domain/management";
import { useEffect } from "react";
import { isToRenew, renew } from "./util/jwt";

export const App = () => {
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (isToRenew()) {
        renew()
      }
    }, 60000)

    return () => clearInterval(intervalId)
  })
  

  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/login' element={<AccountLogin/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/user_edit' element={<UserEdit/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='/domain' element={<DomainOverview/>}/>
            <Route path='/domain/management/:domain_uuid' element={<DomainManagement/>}/>
            <Route path='/domain/create' element={<DomainCreation/>}/>
            <Route path='/account/creation' element={<AccountCreation/>}/>
            <Route path='account' element={<AccountSetting/>}/>
            <Route path='/' element={<Navigate to='domain' replace/>}/>
          </Route>
        </Route>
      </Routes>
    </ChakraProvider>
  )
}
