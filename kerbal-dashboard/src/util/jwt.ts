import request from "./request";
import { decode } from "base-64";

export const isToRenew = () => {
  if (localStorage.getItem('token')) {
    const payloadString = (localStorage.getItem('token') as string).split('.')[1]
    const payload = JSON.parse(decode(payloadString))
    const iat = parseInt(payload['iat'])
    const iatTime = new Date(iat * 1000)
    const currentTime = new Date()
    const timeDiff = currentTime.getTime() - iatTime.getTime()
    return timeDiff > 30 * 60 * 1000
  }
}

export const renew = () => {
  request.post(
    '/api/users/renew'
  ).then(response => {
    localStorage.setItem('token', response.data['token'])
  })
}