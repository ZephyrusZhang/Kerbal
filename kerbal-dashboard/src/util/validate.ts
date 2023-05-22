import { emailRegex, passwordRegex } from "../const";

export const validatePassword = (values: {password: string, passwordConfirmation: string}) => {
  const errors: { password?: string, passwordConfirmation?: string } = {}
  if (values.password === '') errors.password = 'Password is required'
  else if (!passwordRegex.test(values.password)) errors.password = 'Invalid password'
  if (values.passwordConfirmation !== values.password) errors.passwordConfirmation = 'The password entered twice does not match'
  return errors
}

export const validateEmail = (email: string) => {
  const errors: {email?: string} = {}
  if (email === '') errors.email = 'Email is required'
  else if (!emailRegex.test(email)) errors.email = 'Email is invalid'
  return errors
}