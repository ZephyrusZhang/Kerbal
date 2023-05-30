import React, { useState } from 'react';
import { Field, FieldProps, Form, Formik } from "formik";
import {
  Button,
  FormControl, FormErrorMessage,
  FormLabel, HStack, IconButton, Input,
  InputGroup, InputRightAddon, NumberDecrementStepper, NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper, Stack,
  Switch, Textarea,
  VStack
} from "@chakra-ui/react";
import { FiTrash2 } from "react-icons/all";
import { AddIcon } from "@chakra-ui/icons";
import { validatePort } from "../../../util/validate";

interface FormProps {
  toggleAutomaticShutdown: boolean,
  autoShutdownPeriod: number,
  guestPort?: string,
  domainPort?: string,
  sshPublicKey: string
}

interface Props {
  uuid: string
}

const parseGuestPort = (portBind: string) => portBind.split(':')[0]
const parseDomainPort = (portBind: string) => portBind.split(':')[1]

const DomainProperties = (props: Props) => {
  const formInitValue: FormProps = {
    toggleAutomaticShutdown: true,
    autoShutdownPeriod: 1,
    sshPublicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCrgvD+ZaiHOGJ71PmLZSGMPr/O1mgJLst56UnqdPja9TdTP9gN/WG+v2xytp5an9zd3YGsmk38nW31sY2wrQgXEP6UykJtrdAv2cic/XdrKoXOkXgDJxVDb6F0vobNOZ8R52pRhaNJTwFzT86Z7gxcLRB+sagst9cHP5Ry18m4sBJXJ/zUeu4ecZgfG/gyTQ5/bPrkwEbkt3qCTkKYNodvB/7p/mQUlHeDlW2FWrk3nQ1Y2+VvptuTN1xyW550c3n9VOmdxpvq7kW8SjEjnZNhT0jK5cbqdt3BVrSjIX2m2JP8vGWc2qZSKuvIU2RO60TtkilZNEeZmFs1nKJ/+7BumObhGlP+dB6Fplg2gG+VyywX0JBdQ1/3x/D0Ydh16Fnl+TlVcewzdsVGVIJVJGfDmuAlmIDAi1TnSxzZB4gzwemaqozGZ1U3E88R7cb70kkk7RyKdKG7tlNxorw5Zxm1uEGqDDmZN54kHqHTz0F70J+nuSmy6Sn+ilMj/3FPvHBnf56SGuE0OyNzEJf9oswauGvQD9ZBQ7GSHETRxgJDDNPocrnZjmGoCmtpmroF56TywWGkiRBEDP9LRdzlplz83vSbtMRb6GnDWzXocORfraldsnOu0uu5EJ7sieuJs0xxnosmYRhP5Q/OaxxzpPjTLCVwXbTLrc47+S5QHNe7kw== 2996362441@qq.com\n'
  }

  const handleSubmit = async (values: FormProps) => {
    console.log(values)
    console.log(props)
  }

  const [portBinds, setPortBinds] = useState<Array<string>>([])

  const validate = (values: FormProps) => {
    return {
      ...validatePort('guestPort', values.guestPort as string),
      ...validatePort('domainPort', values.domainPort as string)
    }
  }

  return (
    <Formik initialValues={formInitValue} onSubmit={handleSubmit} validate={validate}>
      {({
          values,
          errors,
          touched,
          handleSubmit,
          setFieldValue,
          setErrors,
          validateForm
        }) => {
        const handleCreateBind = (guestPort?: string, domainPort?: string) => {
          validateForm(values).then((err) => {
            setErrors(err)
            if (!(!!(err.guestPort && err.domainPort && touched.guestPort && touched.domainPort))) {
              setPortBinds([...portBinds, `${guestPort}:${domainPort}`])
            }
          })
        }

        const handleDeleteBind = (idx: number) => {
          setFieldValue('portBinds', portBinds.filter((_, index) => idx !== index))
        }

        return (
          <Form onSubmit={handleSubmit}>
            <VStack spacing={10}>
              <FormControl>
                <FormLabel>Automatic Shutdown</FormLabel>
                <Field name='toggleAutomaticShutdown' as={Switch} isChecked={values.toggleAutomaticShutdown}/>
              </FormControl>
              <FormControl>
                <FormLabel>Auto-shutdown period</FormLabel>
                <InputGroup>
                  <Field name='autoShutdownPeriod'>
                    {({field, form}: FieldProps) => (
                      <NumberInput
                        id='autoShutdownPeriod'
                        {...field}
                        onChange={(value) => {
                          if (parseInt(value) > 0) form.setFieldValue(field.name, value)
                        }}
                      >
                        <NumberInputField/>
                        <NumberInputStepper>
                          <NumberIncrementStepper/>
                          <NumberDecrementStepper/>
                        </NumberInputStepper>
                      </NumberInput>
                    )}
                  </Field>
                  <InputRightAddon>h</InputRightAddon>
                </InputGroup>
              </FormControl>
              <FormControl
                isInvalid={!!(errors.guestPort && errors.domainPort && touched.guestPort && touched.domainPort)}>
                <FormLabel>Port Mapping</FormLabel>
                <Stack>
                  {portBinds.map((value, index) => (
                    <HStack key={index}>
                      <Input value={parseGuestPort(value)} isDisabled/>
                      <Input value={parseDomainPort(value)} isDisabled/>
                      <IconButton
                        aria-label='delete-bind'
                        icon={<FiTrash2/>}
                        colorScheme='red'
                        variant='outline'
                        onClick={() => handleDeleteBind(index)}
                      />
                    </HStack>
                  ))}
                  <HStack align='flex-start' alignItems='stretch'>
                    <VStack align='flex-start' justify='flex-start'>
                      <Field as={Input} placeholder='Guest Port' name='guestPort' type='number'/>
                      <FormErrorMessage>{errors.guestPort}</FormErrorMessage>
                    </VStack>
                    <VStack align='flex-start' justify='flex-start'>
                      <Field as={Input} placeholder='Domain Port' name='domainPort' type='number'/>
                      <FormErrorMessage>{errors.domainPort}</FormErrorMessage>
                    </VStack>
                    <IconButton
                      aria-label='delete-bind'
                      icon={<AddIcon/>}
                      colorScheme='whatsapp'
                      variant='outline'
                      onClick={() => handleCreateBind(values.guestPort, values.domainPort)}
                    />
                  </HStack>
                </Stack>
              </FormControl>
              <FormControl>
                <FormLabel>SSH Public Key</FormLabel>
                <Field as={Textarea} name='sshPublicKey'/>
              </FormControl>
              <Button type='submit' colorScheme='messenger'>Save</Button>
            </VStack>
          </Form>
        )
      }}
    </Formik>
  )
}

export default DomainProperties;
