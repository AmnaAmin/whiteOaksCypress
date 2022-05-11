import React, { useState } from 'react'
import { Button, FormControl, Grid, GridItem } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormSelect } from 'components/react-hook-form-fields/select'

export const ManageProject: React.FC<{
  isLoading: boolean
}> = () => {
  const { register, control } = useForm<{}>({})

  const [showModal, setShowModal] = useState(false)

  const types = [
    { value: '1', label: 'A' },
    { value: '2', label: 'B' },
    { value: '3', label: 'C' },
  ]

  const onClose = () => {
    setShowModal(false)
  }

  return (
    <form>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={''}
              label={'Field Project Manager'}
              name={`FPM`}
              control={control}
              options={types}
              rules={{ required: 'This is required field' }}
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
              //   controlStyle={{ w: '20em' }}
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
              //   controlStyle={{ w: '20em' }}
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
              //  controlStyle={{ w: '20em' }}
              rules={{ required: 'This is required field' }}
              name={`superEmail`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid display="flex" position={'absolute'} right={10} bottom={5}>
        <Button onClick={onClose} variant="outline" size="md" color="#4E87F8" border="2px solid #4E87F8">
          {'Cancel'}
        </Button>
        <Button
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          _hover={{ bg: 'blue' }}
          type="submit"
          ml="3"
          size="md"
          // disabled={true}
        >
          {'Next'}
        </Button>
      </Grid>
    </form>
  )
}
