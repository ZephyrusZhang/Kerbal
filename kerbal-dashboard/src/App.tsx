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
import ContainerCreation from "./screens/container/ContainerCreation";
import UserEdit from './screens/UserEdit'
import AccountSetting from "./screens/account-setting";
import ContainerOverview from "./screens/container/ContainerOverview";
import ContainerSetting from "./screens/container/ContainerSetting";

export const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Routes>
        <Route path='/login' element={<AccountLogin/>}/>
        <Route path='/test' element={<Test/>}/>
        <Route path='/user_edit' element={<UserEdit/>}/>
        <Route path='/' element={<Layout/>}>
          <Route path='/' element={<PrivateRoute/>}>
            <Route path='/container' element={<ContainerOverview/>}/>
            <Route path='/container/setting/:domain_uuid' element={<ContainerSetting/>}/>
            <Route path='/container/create' element={<ContainerCreation/>}/>
            <Route path='/account/creation' element={<AccountCreation/>}/>
            <Route path='account' element={<AccountSetting/>}/>
            <Route path='/' element={<Navigate to='container' replace/>}/>
          </Route>
        </Route>
      </Routes>
    </ChakraProvider>
  )
}
