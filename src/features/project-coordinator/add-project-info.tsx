import React from 'react'
import { Button, FormControl, FormLabel, Grid, GridItem, Input, Select } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { FormInput } from 'components/react-hook-form-fields/input'
import { FormDatePicker } from 'components/react-hook-form-fields/date-picker'
import { useForm } from 'react-hook-form'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'

export const AddProjectInfo: React.FC<{
  isLoading: boolean
}> = () => {
  const { t } = useTranslation()
  const {
    register,
    formState: { errors },
    control,
  } = useForm<[]>({})

  return (
    <form>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormLabel fontSize="14px" color="gray.600" fontWeight={500}>
              {'Project Name'}
            </FormLabel>
            <Input></Input>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel fontSize="14px" color="gray.600" fontWeight={500}>
              {'Type'}
            </FormLabel>
            <Select>
              <option>Select</option>
            </Select>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel fontSize="14px" color="gray.600" fontWeight={500}>
              {'WO Number'}
            </FormLabel>
            <Input></Input>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel fontSize="14px" color="gray.600" fontWeight={500}>
              {'PO Number'}
            </FormLabel>
            <Input></Input>
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormDatePicker
              errorMessage={errors}
              label={'Client Start Date'}
              name={`clientStartDate`}
              control={control}
              rules={{ required: 'This is required field' }}
              style={{ w: '20em' }}
              placeholder={'mm/dd/yyyy'}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormDatePicker
              errorMessage={''}
              label={'Client Due Date'}
              name={`clientDueDate`}
              control={control}
              rules={{ required: 'This is required field' }}
              style={{ w: '20em' }}
              placeholder={'mm/dd/yyyy'}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormDatePicker
              errorMessage={''}
              label={'WO Start Date'}
              name={`WOStartDate`}
              control={control}
              rules={{ required: 'This is required field' }}
              style={{ w: '20em' }}
              placeholder={'mm/dd/yyyy'}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Original SOW Amount'}
              placeholder="$"
              register={register}
              controlStyle={{ w: '20em' }}
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
              style={{ w: '20em' }}
            >
              <Button rounded="none" roundedLeft={5} fontSize={14} fontWeight={500} bg="gray.100" h="37px">
                {t('chooseFile')}
              </Button>
            </FormFileInput>
          </FormControl>
        </GridItem>
      </Grid>
    </form>
  )
}
