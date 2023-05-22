import axios from "axios";
import { isToRenew } from "./jwt";
import { responseToast } from "./toast";

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
        {
          headers: {
            Authorization: localStorage.getItem('token')
          }
        }
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
  },
  error => {
    responseToast('err', '', `err${error}`)
    return Promise.reject(error)
  }
)

export default request
