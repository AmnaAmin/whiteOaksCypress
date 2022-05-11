import React, { useCallback, useEffect, useState } from 'react'
import { Button, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { useProjectDetails, useProjectTypes, useSaveProjectDetails } from 'utils/pc-projects'
import { ProjectInfo } from 'types/project.type'
import { useParams } from 'react-router-dom'
import { readFileContent } from 'utils/vendor-details'
import { currencyFormatter } from 'utils/stringFormatters'

type InfoProps = {
  setNextTab: () => void
  onClose: () => void
}

export const AddProjectInfo = React.forwardRef((props: InfoProps, ref) => {
  const { data: projectTypes } = useProjectTypes()
  const { projectId } = useParams<{ projectId: string }>()
  // const { data: project, refetch } = useProjectDetails(projectId)
  const { mutate: saveProjectDetails } = useSaveProjectDetails()

  const types = projectTypes
    ? projectTypes?.map(type => ({
        label: type?.value,
        value: type?.id,
      }))
    : null

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'gray.600',
  }
  const inputStyle = {
    bg: 'white',
    borderLeft: '1.5px solid #4E87F8',
  }

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<ProjectInfo>()

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      console.log('Value Change', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])

  const onSubmit = useCallback(
    async value => {
      let fileContents: any = null
      if (value.projectSOW && value.projectSOW[0]) {
        fileContents = await readFileContent(value.projectSOW[0])
      }
      const projectPayload = {
        name: value.name,
        projectType: value.projectType,
        woNumber: value.woNumber,
        poNumber: value.poNumber,
        clientStartDate: value.clientStartDate,
        clientDueDate: value.clientDueDate,
        woaStartDate: value.woaStartDate,
        sowOriginalContractAmount: currencyFormatter(value.sowOriginalContractAmount),
        projectSOW: value.projectSOW && value.projectSOW[0] ? value.projectSOW[0].name : null,
        sowLink: fileContents,
      }
      console.log('payload', projectPayload)
      saveProjectDetails(projectPayload, {
        onSuccess() {
          props.setNextTab()
        },
      })
    },
    [saveProjectDetails],
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.name && errors.name?.message}
              label={'Project Name'}
              placeholder=""
              register={register}
              rules={{ required: 'This is required field' }}
              name={`name`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={errors.projectType && errors.projectType?.message}
              label={'Type'}
              name={`projectType`}
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
              errorMessage={errors.woNumber && errors.woNumber?.message}
              label={'WO Number'}
              placeholder=""
              register={register}
              rules={{ required: 'This is required field' }}
              name={`woNumber`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.poNumber && errors.poNumber?.message}
              label={'PO Number'}
              placeholder=""
              register={register}
              rules={{ required: 'This is required field' }}
              name={`poNumber`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem style={{ textAlign: 'left' }}>
          <FormControl>
            <FormLabel sx={labelStyle}>Client Start Date</FormLabel>
            <Input
              type="date"
              {...register('clientStartDate')}
              name={`clientStartDate`}
              placeholder={'mm/dd/yyyy'}
              sx={inputStyle}
              required
            />
            <FormErrorMessage>{errors.clientStartDate && errors.clientStartDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>Client Due Date</FormLabel>
            <Input
              type="date"
              {...register('clientDueDate')}
              name={`clientDueDate`}
              placeholder={'mm/dd/yyyy'}
              sx={inputStyle}
              required
            />
            <FormErrorMessage>{errors.clientDueDate && errors.clientDueDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel sx={labelStyle}>WOA Start Date</FormLabel>
            <Input
              type="date"
              {...register('woaStartDate')}
              name={`woaStartDate`}
              placeholder={'mm/dd/yyyy'}
              sx={inputStyle}
              required
            />
            <FormErrorMessage>{errors.woaStartDate && errors.woaStartDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3" mt={6}>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.sowOriginalContractAmount && errors.sowOriginalContractAmount?.message}
              label={'Original SOW Amount'}
              placeholder="$"
              register={register}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`sowOriginalContractAmount`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel fontSize="14px" color="gray.600" fontWeight={500} marginBottom={0}>
              Upload Project SOW
            </FormLabel>
            <FormFileInput
              errorMessage={errors.projectSOW && errors.projectSOW?.message}
              label={''}
              name={`projectSOW`}
              register={register}
              isRequired={true}
            >
              <Button
                rounded="none"
                roundedLeft={5}
                fontSize={14}
                fontWeight={500}
                bg="#EDF2F7"
                h="37px"
                color="#4A5568"
              >
                {'ChooseFile'}
              </Button>
            </FormFileInput>
          </FormControl>
        </GridItem>
      </Grid>
      <Grid display="flex" position={'absolute'} right={10} bottom={5}>
        <Button
          variant="outline"
          size="md"
          color="#4E87F8"
          border="2px solid #4E87F8" // onClick={onClose}
        >
          {'Cancel'}
        </Button>
        <Button colorScheme="CustomPrimaryColor" type="submit" size="md" ml="3">
          {'Next'}
        </Button>
      </Grid>
    </form>
  )
})
