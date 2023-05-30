import { emailRegex, passwordRegex } from "../const";

export const validatePassword = (values: { password: string, passwordConfirmation: string }) => {
  const errors: { password?: string, passwordConfirmation?: string } = {}
  if (values.password === '') errors.password = 'Password is required'
  else if (!passwordRegex.test(values.password)) errors.password = 'Invalid password'
  if (values.passwordConfirmation !== values.password) errors.passwordConfirmation = 'The password entered twice does not match'
  return errors
}

export const validateEmail = (email: string) => {
  const errors: { email?: string } = {}
  if (email === '') errors.email = 'Email is required'
  else if (!emailRegex.test(email)) errors.email = 'Email is invalid'
  return errors
}

export const validatePort = (key: string, port: string, notnull = true) => {
  const errors: { [key: string]: string } = {}
  if ((port === '' || port === undefined || port === null) && notnull) errors[key] = 'Port is required'
  else if (!(0 <= parseInt(port) && parseInt(port) <= 65535)) errors[key] = 'Port must be within range of 0 to 65535'
  return errors
}