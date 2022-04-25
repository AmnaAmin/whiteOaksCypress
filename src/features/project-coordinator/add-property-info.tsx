import React from 'react'
import { FormControl, Grid, GridItem } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormSelect } from 'components/react-hook-form-fields/select'

export const AddPropertyInfo: React.FC<{
  isLoading: boolean
}> = () => {
  const { register, control } = useForm<{}>({})

  const states = [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' },
    { value: '3', label: 'C' },
  ]

  const markets = [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' },
    { value: '3', label: 'C' },
  ]

  return (
    <form>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Address'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`address`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'City'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`city`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'State'}
              name={`state`}
              control={control}
              options={states}
              rules={{ required: 'This is required field' }}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Zip'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`zip`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'Markets'}
              name={`markets`}
              control={control}
              options={markets}
              rules={{ required: 'This is required field' }}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Gate Code'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`gateCode`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Lunch Box Code'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`lunchBoxCode`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'HOA Contact Phone'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`HOAContactPhone`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Ext.'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`ext`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'HOA Contact Email'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`HOAContactEmail`}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </form>
  )
}
