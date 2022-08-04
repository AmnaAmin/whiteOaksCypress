import React from 'react'
import { Button, FormControl, FormErrorMessage, FormLabel, Grid, GridItem } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { Controller, useFormContext } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import ReactSelect from 'components/form/react-select'

export const ManageProject: React.FC<{
  isLoading: boolean
  buttonCondition: boolean
  onClose: () => void
  fieldProjectManager: any
  projectCoordinator: any
  client: any
}> = props => {
  // const { data: fieldProjectManager } = useFPM()
  // const { data: projectCoordinator } = usePC()
  // const { data: client } = useClients()

  const FPMs = props?.fieldProjectManager
    ? props?.fieldProjectManager?.map(FPM => ({
        label: FPM?.firstName + ' ' + FPM?.lastName,
        value: FPM?.id,
      }))
    : null

  const PCs = props?.projectCoordinator
    ? props?.projectCoordinator?.map(PC => ({
        label: PC?.firstName + ' ' + PC?.lastName,
        value: PC?.id,
      }))
    : null

  const clients = props?.client
    ? props?.client?.map(client => ({
        label: client?.companyName,
        value: client?.id,
      }))
    : null

  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<ProjectFormValues>()

  const setFPM = e => {
    setValue('projectManagerId', e.value)
  }

  const setPC = e => {
    setValue('projectCoordinator', e.label)
    setValue('projectCoordinatorId', e.value)
  }

  const setClient = e => {
    setValue('clientName', e.label)
    setValue('clientId', e.value)
  }

  return (
    <>
      <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Field Project Manager
            </FormLabel>
            <Controller
              control={control}
              name={`projectManagerId`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <ReactSelect
                    id="projectManagerId"
                    options={FPMs}
                    selected={value}
                    onChange={setFPM}
                    selectProps={{ isBorderLeft: true }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Project Coordinator
            </FormLabel>
            <Controller
              control={control}
              name={`projectCoordinator`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <ReactSelect
                    id="projectCoordinator"
                    options={PCs}
                    selected={value}
                    onChange={setPC}
                    selectProps={{ isBorderLeft: true }}
                  />
                  <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                </>
              )}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Client
            </FormLabel>
            <Controller
              control={control}
              name={`clientName`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <ReactSelect
                    id="clientName"
                    options={clients}
                    selected={value}
                    onChange={setClient}
                    selectProps={{ isBorderLeft: true }}
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
              errorMessage={errors.superLastName && errors.superLastName?.message}
              label={'Client Super Name'}
              placeholder=""
              register={register}
              name={`superLastName`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.superPhoneNumber && errors.superPhoneNumber?.message}
              label={'Super Phone'}
              placeholder=""
              register={register}
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
              name={`superPhoneNumberExtension`}
              elementStyle={{ width: '125px' }}
            />
          </FormControl>
        </GridItem>
        <GridItem mb={145}>
          <FormControl>
            <FormInput
              errorMessage={errors.superEmailAddress && errors.superEmailAddress?.message}
              label={'Super Email'}
              placeholder=""
              register={register}
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
          type="submit"
          disabled={!props.buttonCondition}
          form="newProjectForm"
          colorScheme="CustomPrimaryColor"
          _focus={{ outline: 'none' }}
          _hover={{ bg: 'blue' }}
          ml="3"
          size="md"
        >
          {'Save'}
        </Button>
      </Grid>
    </>
  )
}
