import React, { useState } from 'react'
import { Button, FormControl, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { useForm } from 'react-hook-form'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { FormSelect } from 'components/react-hook-form-fields/select'

export const AddProjectInfo: React.FC<{
  isLoading: boolean
}> = () => {
  const {
    register,
    formState: { errors },
    control,
  } = useForm<{}>({})

  const [startDate] = useState(new Date())
  const types = [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' },
    { value: '3', label: 'C' },
  ]

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'gray.600',
  }
  const inputStyle = {
    bg: 'white',
    borderLeft: '1.5px solid #4E87F8',
  }

  return (
    <form>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <GridItem>
            <FormControl>
              <FormInput
                errorMessage={''}
                label={'Project Name'}
                placeholder=""
                register={register}
                // controlStyle={{ w: '20em' }}
                rules={{ required: 'This is required field' }}
                name={`projectName`}
              />
            </FormControl>
          </GridItem>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'Type'}
              name={`type`}
              control={control}
              options={types}
              rules={{ required: 'This is required field' }}
              // controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <GridItem>
            <FormControl>
              <FormInput
                errorMessage={''}
                label={'WO Number'}
                placeholder=""
                register={register}
                //  controlStyle={{ w: '20em' }}
                rules={{ required: 'This is required field' }}
                name={`WONumber`}
              />
            </FormControl>
          </GridItem>
        </GridItem>
        <GridItem>
          <GridItem>
            <FormControl>
              <FormInput
                errorMessage={''}
                label={'PO Number'}
                placeholder=""
                register={register}
                //   controlStyle={{ w: '20em' }}
                rules={{ required: 'This is required field' }}
                name={`PONumber`}
              />
            </FormControl>
          </GridItem>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem style={{ textAlign: 'left' }}>
          <FormControl>
            <FormLabel sx={labelStyle}>Client Start Date</FormLabel>
            <Input type="date" name={`clientStartDate`} placeholder={'mm/dd/yyyy'} sx={inputStyle} required />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Client Due Date</FormLabel>
            <Input type="date" name={`clientDueDate`} placeholder={'mm/dd/yyyy'} sx={inputStyle} required />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>WOA Start Date</FormLabel>
            <Input type="date" name={`WOAStartDate`} placeholder={'mm/dd/yyyy'} sx={inputStyle} required />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3" mt={6}>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Original SOW Amount'}
              placeholder="$"
              register={register}
              //  controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`originalSOWAmount`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel fontSize="14px" color="gray.600" fontWeight={500} marginBottom={0}>
              Upload Project SOW
            </FormLabel>
            <FormFileInput
              errorMessage={''}
              label={''}
              name={`uploadProjectSOW`}
              register={register}
              isRequired={true}
              //  style={{ w: '20em' }}
            >
              <Button
                rounded="none"
                roundedLeft={5}
                fontSize={14}
                fontWeight={500}
                bg="#EDF2F7"
                h="37px"
                color="#4A5568"
              >
                {'ChooseFile'}
              </Button>
            </FormFileInput>
          </FormControl>
        </GridItem>
      </Grid>
      <Grid display="flex" alignItems="center">
        <Button // onClick={onClose}
          variant="ghost"
          size="sm"
        >
          {'Close'}
        </Button>

        <Button
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          _hover={{ bg: 'blue' }}
          type="submit"
          form="newProjectForm"
          ml="3"
          size="sm"
          disabled={true}
        >
          {'Next'}
        </Button>
      </Grid>
    </form>
  )
}
