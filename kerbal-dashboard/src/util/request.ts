import axios from "axios";
import { decode } from "base-64";
import { isToRenew } from "./jwt";

const request = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 5000
})

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
