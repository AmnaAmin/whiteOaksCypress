import { Box, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input, Stack } from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import { STATUS } from 'features/projects/status'
import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { ProjectType } from 'types/project.type'

const ProjectManagement: React.FC<{ projectData: ProjectType }> = props => {
  const { projectData } = props
  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
  } = useForm()

  const statusNew_Active = [STATUS.New.valueOf(), STATUS.Active.valueOf()].includes(
    (projectData?.projectStatus || '').toLowerCase(),
  )

  const statusClosed = [STATUS.Closed.valueOf()].includes((projectData?.projectStatus || '').toLowerCase())

  const statusInvoiced = [STATUS.Invoiced.valueOf()].includes((projectData?.projectStatus || '').toLowerCase())

  const statusClientPaid = [STATUS.ClientPaid.valueOf()].includes((projectData?.projectStatus || '').toLowerCase())

  const statusPaid = [STATUS.Paid.valueOf()].includes((projectData?.projectStatus || '').toLowerCase())

  const statusOverPayment = [STATUS.Overpayment.valueOf()].includes((projectData?.projectStatus || '').toLowerCase())

  const onSubmit = FormValues => {
    console.log('FormValues', FormValues)
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)} id="project">
        <Stack>
          <Grid templateColumns="repeat(4,1fr)" rowGap="32px" columnGap="16px" w="908px">
            <GridItem>
              <FormControl w="215px" isInvalid={errors.status}>
                <FormLabel variant="strong-label" size="md">
                  Status
                </FormLabel>
                <Controller
                  control={control}
                  name="status"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect {...field} />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl w="215px" isInvalid={errors.type}>
                <FormLabel variant="strong-label" size="md">
                  Type
                </FormLabel>
                <Controller
                  control={control}
                  name="type"
                  rules={{ required: 'This is required' }}
                  render={({ field, fieldState }) => (
                    <>
                      <ReactSelect {...field} selectProps={{ isBorderLeft: true }} />
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </>
                  )}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.woNumber} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="woNumber">
                  WO Number
                </FormLabel>
                <Input
                  placeholder="222"
                  id="woNumber"
                  {...register('woNumber', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.woNumber && errors.woNumber.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.poNumber} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="poNumber">
                  PO Number
                </FormLabel>
                <Input
                  placeholder="3456"
                  id="poNumber"
                  {...register('poNumber', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.poNumber && errors.poNumber.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={!!errors.projectName} w="215px">
                <FormLabel variant="strong-label" size="md" htmlFor="projectName">
                  Project Name
                </FormLabel>
                <Input
                  variant="required-field"
                  placeholder="PC project 1"
                  id="projectName"
                  {...register('projectName', {
                    required: 'This is required',
                  })}
                />
                <FormErrorMessage>{errors.projectName && errors.projectName.message}</FormErrorMessage>
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Start
                </FormLabel>
                <Input
                  type="date"
                  isDisabled={statusClosed || statusInvoiced || statusClientPaid || statusPaid || statusOverPayment}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  WOA Completion
                </FormLabel>
                <Input
                  type="date"
                  isDisabled={statusNew_Active || statusInvoiced || statusClientPaid || statusPaid || statusOverPayment}
                />
              </FormControl>
            </GridItem>
            <GridItem></GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Client Start
                </FormLabel>
                <Input
                  variant="required-field"
                  type="date"
                  isDisabled={statusClosed || statusInvoiced || statusClientPaid || statusPaid || statusOverPayment}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Client Due
                </FormLabel>
                <Input
                  variant="required-field"
                  type="date"
                  isDisabled={statusClosed || statusInvoiced || statusClientPaid || statusPaid || statusOverPayment}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md" whiteSpace="nowrap">
                  Client Walkthrough
                </FormLabel>
                <Input
                  type="date"
                  isDisabled={statusNew_Active || statusClientPaid || statusPaid || statusOverPayment}
                />
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl>
                <FormLabel variant="strong-label" size="md">
                  Client Sign Off
                </FormLabel>
                <Input
                  type="date"
                  isDisabled={statusNew_Active || statusClientPaid || statusPaid || statusOverPayment}
                />
              </FormControl>
            </GridItem>
          </Grid>
        </Stack>
      </form>
    </Box>
  )
}

export default ProjectManagement
