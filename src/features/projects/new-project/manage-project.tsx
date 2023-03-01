import React from 'react'
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import ReactSelect from 'components/form/react-select'
import { useClients, useFPMsByMarket, useProjectCoordinators } from 'api/pc-projects'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { useTranslation } from 'react-i18next'
import { useProjectManagementSaveButtonDisabled } from './hooks'
import NumberFormat from 'react-number-format'
import Select from 'components/form/react-select'

export const ManageProject: React.FC<{
  isLoading: boolean
  onClose: () => void
}> = props => {
  const {
    register,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<ProjectFormValues>()
  const values = getValues()
  const { t } = useTranslation()

  const [formattedClientName, setFormattedClientName] = React.useState('')
  // not used until requirement is clear : const { fieldProjectManagerOptions } = useFPMs()
  const { fieldProjectManagerByMarketOptions } = useFPMsByMarket(values.newMarket?.value)
  const { projectCoordinatorSelectOptions } = useProjectCoordinators()
  const { clientSelectOptions } = useClients()

  const isProjectManagementSaveButtonDisabled = useProjectManagementSaveButtonDisabled(control)
  const setPC = e => {
    setValue('projectCoordinator', e)
  }

  const setClient = option => {
    setValue('client', option)
  }

  const handleChange = e => {
    //  this regex is used to remove any special character
    const result = e.target.value.replace(/[^a-zA-Z\s]/g, '')
    setFormattedClientName(result)
  }

  return (
    <Box>
      <Box px="6" minH="300px">
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} pb="3">
          <GridItem>
            <FormControl>
              <FormLabel  size="md">{t(`${NEW_PROJECT}.fieldProjectManager`)}</FormLabel>
              <Controller
                control={control}
                name={`projectManager`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                    id='project-manager'
                      {...field}
                      options={fieldProjectManagerByMarketOptions}
                      size="md"
                      value={field.value}
                      selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
                      onChange={option => {
                        field.onChange(option)
                      }}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel size="md">{t(`${NEW_PROJECT}.projectCoordinator`)}</FormLabel>
              <Controller
                control={control}
                name={`projectCoordinator`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value }, fieldState }) => (
                  <>
                  <div data-testid='project_Cordinator'>
                    <ReactSelect
                      id="projectCoordinator"
                      options={projectCoordinatorSelectOptions}
                      selected={value}
                      onChange={setPC}
                      selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </div>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel size="md" htmlFor="client">
                {t(`${NEW_PROJECT}.client`)}
              </FormLabel>
              <Controller
                control={control}
                name={`client`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value }, fieldState }) => (
                  <>
                    <ReactSelect
                      id="client"
                      options={clientSelectOptions}
                      selected={value}
                      onChange={setClient}
                      selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel size="md">{t(`${NEW_PROJECT}.clientSuperName`)}</FormLabel>
              <Input
                id="clientSuperName"
                {...register('superLastName')}
                value={formattedClientName}
                onChange={handleChange}
              />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3">
          <GridItem>
            <FormControl>
              <FormLabel size="md" htmlFor="superPhone">
                {t(`${NEW_PROJECT}.superPhoneNumber`)}
              </FormLabel>
              <Controller
                control={control}
                name="superPhoneNumber"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        id="superPhoneNumber"
                        customInput={Input}
                        value={field.value}
                        onChange={e => field.onChange(e)}
                        format="(###)-###-####"
                        mask="_"
                        placeholder="(___)-___-____"
                      />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )
                }}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel size="md" htmlFor="superPhoneNumberExtension">
                {t(`${NEW_PROJECT}.ext`)}
              </FormLabel>
              <Input id="superPhoneNumberExtension" {...register('superPhoneNumberExtension')} type="number" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.superEmailAddress}>
              <FormLabel size="md" htmlFor="superEmail">
                {t(`${NEW_PROJECT}.superEmail`)}
              </FormLabel>
              <Input
                id="superEmail"
                {...register('superEmailAddress', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid Email Address',
                  },
                })}
              />
              <FormErrorMessage>{errors.superEmailAddress && errors.superEmailAddress.message}</FormErrorMessage>
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
      <Flex justifyContent="end" borderTop="1px solid #E2E8F0" pt="5" px="6">
        <Button onClick={props.onClose} variant="outline" size="md" colorScheme="brand">
          {t(`${NEW_PROJECT}.cancel`)}
        </Button>
        <Button
          type="submit"
          disabled={isProjectManagementSaveButtonDisabled || props.isLoading}
          form="newProjectForm"
          colorScheme="brand"
          ml="3"
          size="md"
        >
          {t(`${NEW_PROJECT}.save`)}
        </Button>
      </Flex>
    </Box>
  )
}
