import React from 'react'
import { Box, Button, Flex, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
import { Controller, useFormContext } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import ReactSelect from 'components/form/react-select'
import { useClients, useFPMs, useProjectCoordinators } from 'utils/pc-projects'
import { NEW_PROJECT } from 'features/projects/projects.i18n'
import { useTranslation } from 'react-i18next'
import { useProjectManagementSaveButtonDisabled } from './hooks'
import NumberFormat from 'react-number-format'

export const ManageProject: React.FC<{
  isLoading: boolean
  onClose: () => void
}> = props => {
  const { t } = useTranslation()
  const { fieldProjectManagerOptions } = useFPMs()
  const { projectCoordinatorSelectOptions } = useProjectCoordinators()
  const { clientSelectOptions } = useClients()

  const { register, control, setValue } = useFormContext<ProjectFormValues>()

  const isProjectManagementSaveButtonDisabled = useProjectManagementSaveButtonDisabled(control)

  const setFPM = option => {
    setValue('projectManager', option)
  }

  const setPC = e => {
    setValue('projectCoordinator', e)
  }

  const setClient = option => {
    setValue('client', option)
  }

  return (
    <Flex flexDir="column" minH="420px">
      <Box flex="1">
        <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} pb="3">
          <GridItem>
            <FormControl>
              <FormLabel size="md">{t(`${NEW_PROJECT}.fieldProjectManager`)}</FormLabel>
              <Controller
                control={control}
                name={`projectManager`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value }, fieldState }) => (
                  <>
                    <ReactSelect
                      id="projectManager"
                      options={fieldProjectManagerOptions}
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
              <FormLabel size="md">{t(`${NEW_PROJECT}.projectCoordinator`)}</FormLabel>
              <Controller
                control={control}
                name={`projectCoordinator`}
                rules={{ required: 'This is required field' }}
                render={({ field: { value }, fieldState }) => (
                  <>
                    <ReactSelect
                      id="projectCoordinator"
                      options={projectCoordinatorSelectOptions}
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
              <FormLabel size="md">{t(`${NEW_PROJECT}.clientSuperName`)}</FormLabel>
              <Input id="clientSuperName" {...register('superLastName')} />
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
              <Input id="superPhoneNumberExtension" {...register('superPhoneNumberExtension')} />
            </FormControl>
          </GridItem>
          <GridItem mb={145}>
            <FormControl>
              <FormLabel size="md" htmlFor="superEmail">
                {t(`${NEW_PROJECT}.superEmail`)}
              </FormLabel>
              <Input id="superEmail" {...register('superEmailAddress')} />
            </FormControl>
          </GridItem>
        </Grid>
      </Box>
      <Flex justifyContent="end" borderTop="1px solid #E2E8F0" pt="5">
        <Button onClick={props.onClose} variant="outline" size="md" colorScheme="brand">
          {t(`${NEW_PROJECT}.cancel`)}
        </Button>
        <Button
          type="submit"
          disabled={isProjectManagementSaveButtonDisabled}
          form="newProjectForm"
          colorScheme="brand"
          ml="3"
          size="md"
        >
          {t(`${NEW_PROJECT}.save`)}
        </Button>
      </Flex>
    </Flex>
  )
}
