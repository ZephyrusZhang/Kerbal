import { createStandaloneToast } from "@chakra-ui/react";

const {ToastContainer, toast} = createStandaloneToast()

const responseToast = (status: 'ok' | 'err', okmsg = 'success', errmsg = 'error') => {
  toast({
    title: function () {
      switch (status) {
        case 'ok':
          return okmsg
        default:
          return errmsg
      }
    }(),
    status: function () {
      switch (status) {
        case 'ok':
          return 'success'
        default:
          return 'error'
      }
    }(),
    duration: 5000,
    isClosable: true
  })
}

export const showToast = (msg: string, typ: string) => {
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

export { ToastContainer, responseToast, toast }