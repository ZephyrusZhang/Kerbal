import axios from "axios";
import { isToRenew } from "./jwt";
const request = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 5000
}) 

import { useToast } from '@chakra-ui/react'
export const ShowToast= (toast: ReturnType<typeof useToast>, msg: string, typ: string) => {
  toast({
    position: 'top',
    status: function () { // stupid js need this to assure the return data?
      switch (typ) {
        case 'success':
          return 'success'
        case 'error':
          return 'error'
        case 'warning':
          return 'warning'
        case 'info':
          return 'info'
        default:
          return 'loading'
        }}(),
    duration: 2000,
    description: msg
  })
}

request.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/json;charset=utf-8'
  if (localStorage.getItem('token') !== null) {
    if (isToRenew()) {
      axios.post(
        'http://localhost:3000/api/users/renew',
        {},
        {headers: {
            Authorization: localStorage.getItem('token')
          }}
      ).then(response => {
        localStorage.setItem('token', response.data['token'])
      })
    }

    config.headers['Authorization'] = localStorage.getItem('token')
  }
  return config
}, error => {
  return Promise.reject(error)
})

request.interceptors.response.use(
  response => {
    return response
      // let res = response.data;
      // if (response.config.responseType === 'blob') {
      //     return res
      // }
      // if (typeof res === 'string') {
      //     res = res ? JSON.parse(res) : res
      // }
      // return res;
  },
  error => {
      console.log('err' + error) // for debug
      return Promise.reject(error)
  }
)

export default request
