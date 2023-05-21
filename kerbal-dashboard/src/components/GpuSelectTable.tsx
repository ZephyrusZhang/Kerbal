import React, { useEffect, useRef, useState } from 'react';
import {
  Button, Checkbox,
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
import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";
import { BsFilter } from "react-icons/bs";
import { Field, FieldInputProps, Form, Formik, FormikProps } from "formik";
import SelectMenu from "./SelectMenu";
import { GpuProps } from "../types";

interface Props extends TableProps {
  data: Array<GpuProps & {isSelected?: boolean}>,
  onCheckGpu: (gpu_id: string, isSelected: boolean) => void
}

interface FilterOptionProps {
  name?: string,
  vram_size?: number
}

const GPUSelectTable = ({data, onCheckGpu, ...props}: Props) => {
  const [sortOrder, setSortOrder] = useState<'sequence' | 'reverse'>('reverse')
  const [displayData, setDisplayData] = useState(data)
  const {isOpen, onOpen, onClose} = useDisclosure()
  const filterBtnRef = useRef<HTMLButtonElement>(null)
  const filterInitialValue: FilterOptionProps = {
    name: undefined,
    vram_size: 0
  }

  const handleFilterSubmit = async (values: FilterOptionProps) => {
    onClose()
    setDisplayData(data.filter(item => item.vram_size > (values.vram_size as number)))
    if (values.name !== undefined)
      setDisplayData(data.filter(item => item.name === values.name))

    //GPT xjb改的，先扔一个在这里看看
    // setDisplayData(
    //   data.filter((item) => {
    //     const isVramMatched = item.vram > (values.vram as number);
    //     const isNameMatched = values.name === undefined || item.name === values.name;
    //     return isVramMatched && isNameMatched;
    //   })
    // );
  }

  const handleClickSort = () => {
    if (sortOrder == 'sequence') {
      displayData.sort((a, b) => a.vram_size - b.vram_size)
      setSortOrder('reverse')
    } else {
      displayData.sort((a, b) => b.vram_size - a.vram_size)
      setSortOrder('sequence')
    }
  }

  useEffect(() => {
    setDisplayData(data)
  }, [data])

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
              <Td>{item.vram_size}</Td>
              <Td>
                <Checkbox
                  isChecked={item.isSelected}
                  onChange={event => onCheckGpu(item.gpu_id, event.target.checked)
                }/>
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
