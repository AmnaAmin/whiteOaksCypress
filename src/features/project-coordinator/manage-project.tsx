import React from 'react'
import { FormControl, Grid, GridItem } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormSelect } from 'components/react-hook-form-fields/select'

export const ManageProject: React.FC<{
  isLoading: boolean
}> = () => {
  const { register, control } = useForm<{}>({})

  const types = [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' },
    { value: '3', label: 'C' },
  ]

  return (
    <form>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'Field Project Manager'}
              name={`FPM`}
              control={control}
              options={types}
              rules={{ required: 'This is required field' }}
              controlStyle={{ w: '20em' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'Project Coordinator'}
              name={`projectCoordinator`}
              control={control}
              options={types}
              rules={{ required: 'This is required field' }}
              controlStyle={{ w: '20em' }}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'Client'}
              name={`client`}
              control={control}
              options={types}
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
              label={'Client Super Name'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`clientSuperName`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={''}
              label={'Super Phone'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`superPhone`}
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
              label={'Super Email'}
              placeholder=""
              register={register}
              controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`superEmail`}
            />
          </FormControl>
        </GridItem>
      </Grid>
    </form>
  )
}
