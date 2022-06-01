import React from 'react'
import { Button, FormControl, FormErrorMessage, FormLabel, Grid, GridItem, Input } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { Controller, useFormContext } from 'react-hook-form'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { useProjectTypes } from 'utils/pc-projects'
import { ProjectFormValues } from 'types/project.type'
import ReactSelect from 'components/form/react-select'

type InfoProps = {
  setNextTab: () => void
  onClose: () => void
}

export const AddProjectInfo = React.forwardRef((props: InfoProps, ref) => {
  const { data: projectTypes } = useProjectTypes()

  const types = projectTypes
    ? projectTypes?.map(type => ({
        label: type?.value,
        value: type?.id,
      }))
    : null

  const inputStyle = {
    bg: 'white',
    borderLeft: '1.5px solid #4E87F8',
  }

  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<ProjectFormValues>()

  const setProjectType = e => {
    setValue('projectType', e.value)
    setValue('projectTypeLabel', e.label)
  }

  return (
    <>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.name && errors.name?.message}
              label={'Project Name'}
              placeholder=""
              register={register}
              name={`name`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Type
            </FormLabel>
            <Controller
              control={control}
              name={`projectType`}
              rules={{ required: 'This is required field' }}
              render={({ field: { value }, fieldState }) => (
                <>
                  <ReactSelect
                    id="projectType"
                    options={types}
                    selected={value}
                    selectProps={{ isBorderLeft: true }}
                    onChange={setProjectType}
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
              errorMessage={errors.woNumber && errors.woNumber?.message}
              label={'WO Number'}
              placeholder=""
              register={register}
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
              name={`poNumber`}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem style={{ textAlign: 'left' }}>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Client Start Date
            </FormLabel>
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
            <FormLabel variant="strong-label" size="md">
              Client Due Date
            </FormLabel>
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
            <FormLabel variant="strong-label" size="md">
              WOA Start Date
            </FormLabel>
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
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3" mt={3}>
        <GridItem>
          <FormControl>
            <FormInput
              errorMessage={errors.sowOriginalContractAmount && errors.sowOriginalContractAmount?.message}
              label={'Original SOW Amount'}
              placeholder="$0"
              register={register}
              elementStyle={{ bg: 'white', borderLeft: '1.5px solid #4E87F8' }}
              rules={{ required: 'This is required field' }}
              name={`sowOriginalContractAmount`}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md" marginBottom={0}>
              Upload Project SOW
            </FormLabel>
            <FormFileInput
              errorMessage={errors.documents && errors.documents?.message}
              label={''}
              name={`documents`}
              register={register}
              rules={{ required: 'This is required field' }}
            >
              <Button bg="none" rounded="none" roundedLeft={5} fontSize={14} fontWeight={500} h="37px" color="#4A5568">
                {'ChooseFile'}
              </Button>
            </FormFileInput>
          </FormControl>
        </GridItem>
      </Grid>
      <Grid display="flex" position={'absolute'} right={10} bottom={5}>
        <Button variant="outline" size="md" color="#4E87F8" border="2px solid #4E87F8" onClick={props.onClose}>
          {'Cancel'}
        </Button>
        <Button colorScheme="CustomPrimaryColor" size="md" ml="3" onClick={props.setNextTab}>
          {'Next'}
        </Button>
      </Grid>
    </>
  )
})
