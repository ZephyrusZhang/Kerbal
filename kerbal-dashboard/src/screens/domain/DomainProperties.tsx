import React from 'react';
import { Field, FieldProps, Form, Formik } from "formik";
import {
  Button,
  FormControl,
  FormLabel, HStack, Input,
  InputGroup, InputRightAddon, NumberDecrementStepper, NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Switch, Textarea,
  VStack
} from "@chakra-ui/react";

interface FormProps {
  toggleAutomaticShutdown: boolean,
  autoShutdownPeriod: number,
  guestPort: number,
  domainPort: number,
  sshPublicKey: string
}

interface Props {
  uuid: string
}

const DomainProperties = (props: Props) => {
  const formInitValue: FormProps = {
    toggleAutomaticShutdown: true,
    autoShutdownPeriod: 1,
    guestPort: 114514,
    domainPort: 1919810,
    sshPublicKey: 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQCrgvD+ZaiHOGJ71PmLZSGMPr/O1mgJLst56UnqdPja9TdTP9gN/WG+v2xytp5an9zd3YGsmk38nW31sY2wrQgXEP6UykJtrdAv2cic/XdrKoXOkXgDJxVDb6F0vobNOZ8R52pRhaNJTwFzT86Z7gxcLRB+sagst9cHP5Ry18m4sBJXJ/zUeu4ecZgfG/gyTQ5/bPrkwEbkt3qCTkKYNodvB/7p/mQUlHeDlW2FWrk3nQ1Y2+VvptuTN1xyW550c3n9VOmdxpvq7kW8SjEjnZNhT0jK5cbqdt3BVrSjIX2m2JP8vGWc2qZSKuvIU2RO60TtkilZNEeZmFs1nKJ/+7BumObhGlP+dB6Fplg2gG+VyywX0JBdQ1/3x/D0Ydh16Fnl+TlVcewzdsVGVIJVJGfDmuAlmIDAi1TnSxzZB4gzwemaqozGZ1U3E88R7cb70kkk7RyKdKG7tlNxorw5Zxm1uEGqDDmZN54kHqHTz0F70J+nuSmy6Sn+ilMj/3FPvHBnf56SGuE0OyNzEJf9oswauGvQD9ZBQ7GSHETRxgJDDNPocrnZjmGoCmtpmroF56TywWGkiRBEDP9LRdzlplz83vSbtMRb6GnDWzXocORfraldsnOu0uu5EJ7sieuJs0xxnosmYRhP5Q/OaxxzpPjTLCVwXbTLrc47+S5QHNe7kw== 2996362441@qq.com\n'
  }

  const handleSubmit = async (values: FormProps) => {
    console.log(values)
    console.log(props)
  }

  return (
    <Formik initialValues={formInitValue} onSubmit={handleSubmit}>
      {({handleSubmit, values}) => (
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
                      onChange={(value) => form.setFieldValue(field.name, value)}
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
            <FormControl>
              <FormLabel>Port Mapping</FormLabel>
              <HStack>
                <Field as={Input} name='guestPort' placeholder='Guest Port'/>
                <Field as={Input} name='domainPort' placeholder='Domain Port'/>
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>SSH Public Key</FormLabel>
              <Field as={Textarea} name='sshPublicKey'/>
            </FormControl>
            <Button type='submit' colorScheme='messenger'>Save</Button>
          </VStack>
        </Form>
      )}
    </Formik>
  )
}

export default DomainProperties;
