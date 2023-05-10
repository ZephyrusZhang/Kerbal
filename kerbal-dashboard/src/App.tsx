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
import DomainSetting from "./screens/domain/DomainSetting";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/login' element={<AccountLogin/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/user_edit' element={<UserEdit/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='/container' element={<DomainOverview/>}/>
            <Route path='/container/setting/:domain_uuid' element={<DomainSetting/>}/>
            <Route path='/container/create' element={<DomainCreation/>}/>
            <Route path='/account/creation' element={<AccountCreation/>}/>
            <Route path='account' element={<AccountSetting/>}/>
            <Route path='/' element={<Navigate to='container' replace/>}/>
          </Route>
        </Route>
      </Routes>
    </ChakraProvider>
  )
}
