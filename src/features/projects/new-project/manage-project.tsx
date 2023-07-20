import React, { useState } from 'react'
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
import { SelectOption } from 'types/transaction.type'

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
  const [carrierOption, setCarrierOptions] = useState<SelectOption[] | null>()

  const isProjectManagementSaveButtonDisabled = useProjectManagementSaveButtonDisabled(control)
  const setPC = e => {
    setValue('projectCoordinator', e)
  }

  const setClient = option => {
    setValue('client', option)
    setValue('carrier', null)
    setCarrierOptions(
      option?.carrier?.map(c => {
        return {
          label: c.name,
          value: c.id,
        }
      }),
    )
  }

  const handleChange = e => {
    //  this regex is used to remove any special character
    const result = e.target.value.replace(/[^a-zA-Z\s]/g, '')
    setFormattedClientName(result)
  }

  return (
    <Box>
      <Box px="6" h="300px" overflow={'auto'}>
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} pb="3">
          <GridItem>
            <FormControl>
              <FormLabel size="md">{t(`${NEW_PROJECT}.fieldProjectManager`)}</FormLabel>
              <Controller
                control={control}
                name={`projectManager`}
                rules={{ required: 'This is required field' }}
                render={({ field, fieldState }) => (
                  <>
                    <Select
                      id="project-manager"
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
                    <div data-testid="project_Cordinator">
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

          <GridItem>
            <FormControl>
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.clientType`)} size="md">
                {t(`${NEW_PROJECT}.clientType`)}
              </FormLabel>
              <Controller
                control={control}
                name={`clientType`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value, onChange }, fieldState }) => (
                  <>
                    <ReactSelect
                      id="clientType"
                      // options={projectTypeSelectOptions}
                      options={clientSelectOptions}
                      selected={value}
                      selectProps={{ isBorderLeft: true, menuHeight: '215px' }}
                      onChange={option => onChange(option)}
                    />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
        </Grid>
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3">
          <GridItem>
            <FormControl>
              <FormLabel size="md" htmlFor="client">
                {t(`${NEW_PROJECT}.carrier`)}
              </FormLabel>
              <Controller
                control={control}
                name={`carrier`}
                render={({ field, fieldState }) => (
                  <>
                    <Select  
                    menuPlacement="top"
                    selectProps={{ menuHeight: '180px' }} 
                    options={carrierOption} {...field} />
                    <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                  </>
                )}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.name} height="100px">
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.agentName`)} size="md" htmlFor="name">
                {t(`${NEW_PROJECT}.agentName`)}
              </FormLabel>
              <Input id="agentName" {...register('agentName', {})} autoComplete="off" />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors?.agentPhone}>
              <FormLabel htmlFor="phone" size="md">
                {t(`${NEW_PROJECT}.phone`)}
              </FormLabel>
              <Controller
                control={control}
                name="agentPhone"
                render={({ field, fieldState }) => {
                  return (
                    <>
                      <NumberFormat
                        id="agentPhone"
                        customInput={Input}
                        value={field.value}
                        onChange={e => {
                          field.onChange(e)
                        }}
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
            <FormControl isInvalid={!!errors?.agentEmail} height="100px">
              <FormLabel isTruncated title={t(`${NEW_PROJECT}.email`)} size="md" htmlFor="name">
                {t(`${NEW_PROJECT}.email`)}
              </FormLabel>
              <Input
                id="agentEmail"
                {...register('agentEmail', {
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: 'Invalid Email Address',
                  },
                })}
              />
              <FormErrorMessage>{errors?.agentEmail?.message}</FormErrorMessage>
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
