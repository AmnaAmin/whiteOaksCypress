import React from 'react'
import { Button, FormControl, FormErrorMessage, FormLabel, Grid, GridItem } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { Controller, useForm } from 'react-hook-form'
import { useClients, useFPM, usePC } from 'utils/pc-projects'
import { ProjectFormValues } from 'types/project.type'
import Select from 'react-select'

export const ManageProject: React.FC<{
  isLoading: boolean
  onClose: () => void
}> = props => {
  const { data: fieldProjectManager } = useFPM()
  const { data: projectCoordinator } = usePC()
  const { data: client } = useClients()

  const FPMs = fieldProjectManager
    ? fieldProjectManager?.map(FPM => ({
        label: FPM?.firstName,
        value: FPM?.id,
      }))
    : null

  const PCs = projectCoordinator
    ? projectCoordinator?.map(PC => ({
        label: PC?.firstName,
        value: PC?.id,
      }))
    : null

  const clients = client
    ? client?.map(client => ({
        label: client?.companyName,
        value: client?.id,
      }))
    : null

  const {
    register,
    formState: { errors },
    control,
    watch,
  } = useForm<ProjectFormValues>()

  return (
    <>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormLabel>Field Project Manager</FormLabel>
            <Controller
              control={control}
              name={`projectManager`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <Select
                    id="projectManager"
                    options={FPMs}
                    selected={value}
                    elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel>Project Coordinator</FormLabel>
            <Controller
              control={control}
              name={`projectCoordinator`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <Select
                    id="projectCoordinator"
                    options={PCs}
                    selected={value}
                    elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormLabel>Client</FormLabel>
            <Controller
              control={control}
              name={`clientName`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <Select
                    id="clientName"
                    options={clients}
                    selected={value}
                    elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.superFirstName && errors.superFirstName?.message}
              label={'Client Super Name'}
              placeholder=""
              register={register}
              rules={{ required: 'This is required field' }}
              name={`superFirstName`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.superPhoneNumber && errors.superPhoneNumber?.message}
              label={'Super Phone'}
              placeholder=""
              register={register}
              rules={{ required: 'This is required field' }}
              name={`superPhoneNumber`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.superPhoneNumberExtension && errors.superPhoneNumberExtension?.message}
              label={'Ext.'}
              placeholder=""
              register={register}
              rules={{ required: 'This is required field' }}
              name={`superPhoneNumberExtension`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.superEmailAddress && errors.superEmailAddress?.message}
              label={'Super Email'}
              placeholder=""
              register={register}
              rules={{ required: 'This is required field' }}
              name={`superEmailAddress`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid display="flex" position={'absolute'} right={10} bottom={5}>
        <Button onClick={props.onClose} variant="outline" size="md" color="#4E87F8" border="2px solid #4E87F8">
          {'Cancel'}
        </Button>
        <Button
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          _hover={{ bg: 'blue' }}
          type="submit"
          ml="3"
          size="md"
        >
          {'Next'}
        </Button>
      </Grid>
    </>
  )
}
