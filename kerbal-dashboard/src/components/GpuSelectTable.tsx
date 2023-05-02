import React, { useRef, useState } from 'react';
import {
  Button,
  Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader,
  DrawerOverlay, FormControl, FormLabel,
  IconButton, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper,
  Table,
  TableProps,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure
} from "@chakra-ui/react";
import { AddIcon, ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { BsFilter } from "react-icons/all";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import SelectMenu from "./SelectMenu";

export type GpuInfo = {
  name: string,
  vram: number,
  count?: number
}

interface Props extends TableProps {
  data: GpuInfo[],
  onAddGpu: (gpu: GpuInfo) => void
}

interface FilterOptionProps {
  name?: string,
  vram?: number
}

const GPUSelectTable = ({data, onAddGpu, ...props}: Props) => {
  const [sortOrder, setSortOrder] = useState<'sequence' | 'reverse'>('reverse')
  const [displayData, setDisplayData] = useState(data)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  const filterInitialValue: FilterOptionProps = {
    name: undefined,
    vram: 0
  }

  const handleFilterSubmit = async (values: FilterOptionProps) => {
    onClose()
    setDisplayData(data.filter(item => item.vram > (values.vram as number)))
    if (values.name !== undefined)
      setDisplayData(data.filter(item => item.name === values.name))
  }

  const handleClickSort = () => {
    if (sortOrder == 'sequence') {
      displayData.sort((a, b) => a.vram - b.vram)
      setSortOrder('reverse')
    } else {
      displayData.sort((a, b) => b.vram - a.vram)
      setSortOrder('sequence')
    }
  }


  return (
    <>
      <Table {...props}>
        <Thead>
          <Tr>
            <Th>Name</Th>
            <Th>
              VRAM(GB)
              {sortOrder === 'sequence' ?
                <IconButton
                  aria-label='sequence'
                  borderRadius='full'
                  variant='link'
                  onClick={handleClickSort}
                  icon={<ArrowDownIcon/>}
                /> :
                <IconButton
                  aria-label='reverse'
                  borderRadius='full'
                  variant='link'
                  onClick={handleClickSort}
                  icon={<ArrowUpIcon/>}
                />}
            </Th>
            <Th>
              <IconButton
                ref={filterBtnRef}
                onClick={onOpen}
                aria-label='filter'
                variant='ghost'
                borderRadius='full'
                icon={<BsFilter/>}
              />
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {displayData.map((item, index) => (
            <Tr key={index}>
              <Td>{item.name}</Td>
              <Td>{item.vram}</Td>
              <Td>
                <IconButton
                  borderRadius='full'
                  size='xs'
                  aria-label={'Add GPU'}
                  icon={<AddIcon/>}
                  onClick={() => onAddGpu(item)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Drawer
        isOpen={isOpen}
        placement='right'
        onClose={onClose}
        finalFocusRef={filterBtnRef}
      >
        <DrawerOverlay/>
        <DrawerContent>
          <DrawerCloseButton/>
          <DrawerHeader>Add filter</DrawerHeader>

          <DrawerBody>
            <Formik initialValues={filterInitialValue} onSubmit={handleFilterSubmit}>
              {() => (
                <Form id='filter-form'>
                  <Field name='vram'>
                    {({field, form}: { field: FieldInputProps<string>, form: FormikProps<FilterOptionProps> }) => (
                      <FormControl>
                        <FormLabel htmlFor='vram'>Min GPU VRAM size (GB)</FormLabel>
                        <NumberInput
                          {...field}
                          name='vram'
                          onChange={val => form.setFieldValue(field.name, val)}
                          min={1}
                        >
                          <NumberInputField/>
                          <NumberInputStepper>
                            <NumberIncrementStepper/>
                            <NumberDecrementStepper/>
                          </NumberInputStepper>
                        </NumberInput>
                      </FormControl>
                    )}
                  </Field>
                  <Field name='name'>
                    {({field}: { field: FieldInputProps<string> }) => (
                      <FormControl>
                        <FormLabel>GPU Name</FormLabel>
                        <SelectMenu
                          {...field}
                          withNoneOption
                          options={data.map(({name}) => ({value: name, text: name}))}
                        />
                      </FormControl>
                    )}
                  </Field>
                </Form>
              )}
            </Formik>
          </DrawerBody>

          <DrawerFooter>
            <Button variant='outline' mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button type='submit' form='filter-form' colorScheme='blue'>Save</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default GPUSelectTable;
