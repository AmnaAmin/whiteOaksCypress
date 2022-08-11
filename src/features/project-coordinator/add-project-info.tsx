import React from 'react'
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  GridItem,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
} from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { Controller, useFormContext, useWatch } from 'react-hook-form'
import { ProjectFormValues } from 'types/project.type'
import ReactSelect from 'components/form/react-select'
import ChooseFileField from 'components/choose-file/choose-file'
import { BiDownload } from 'react-icons/bi'
import { t } from 'i18next'
import { useProjectTypes } from 'utils/projects'

type InfoProps = {
  setNextTab: () => void
  onClose: () => void
  buttonCondition: boolean
  projectTypes?: any
}

const useClientDueMinDate = (control: any) => {
  const startDate = useWatch({ control, name: 'clientStartDate' }) || new Date()
  return new Date(startDate).toISOString()?.split('T')[0]
}

export const AddProjectInfo = React.forwardRef((props: InfoProps, ref) => {
  const { data: projectTypes } = useProjectTypes()

  const types = projectTypes
    ? projectTypes?.map(type => ({
        label: type?.value,
        value: type?.id,
      }))
    : null

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

  const [fileBlob, setFileBlob] = React.useState<Blob>()
  const readFile = (event: any) => {
    setFileBlob(event.target?.result?.split(',')?.[1])
  }

  const onFileChange = (document: File) => {
    if (!document) return

    const reader = new FileReader()
    reader.addEventListener('load', readFile)
    reader.readAsDataURL(document)
    setValue('documents', fileBlob as Blob)
  }

  const downloadDocument = (link, text) => {
    return (
      <a href={link} download style={{ minWidth: '20em', marginTop: '5px', color: '#4E87F8' }}>
        <Flex ml={1}>
          <BiDownload fontSize="sm" />
          <Box ml="5px" fontSize="12px" fontStyle="normal">
            {text}
          </Box>
        </Flex>
      </a>
    )
  }

  const inputStyle = {
    bg: 'white',
    borderLeft: '2.5px solid #4E87F8',
  }

  const clientDueMinDate = useClientDueMinDate(control)

  return (
    <>
      <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'}>
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
      <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3">
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
              min={clientDueMinDate}
            />
            <FormErrorMessage>{errors.clientDueDate && errors.clientDueDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              WOA Start Date
            </FormLabel>
            <Input type="date" {...register('woaStartDate')} name={`woaStartDate`} placeholder={'mm/dd/yyyy'} />
            <FormErrorMessage>{errors.woaStartDate && errors.woaStartDate?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 225px)" gap={'1rem 1.5rem'} py="3" mt={3}>
        <GridItem>
          <FormControl>
            <Heading color="gray.600" fontSize="14px" fontWeight={500} isTruncated>
              {t('Original SOW Amount')}
            </Heading>
            <InputGroup p={0} mt={3}>
              <InputLeftElement color="gray.500" children="$" />
              <Input {...register('sowOriginalContractAmount')} variant="required-field" m={0} pl={5} />
            </InputGroup>
          </FormControl>
        </GridItem>
        <GridItem mb={10}>
          <FormControl>
            <FormLabel variant="strong-label" size="md">
              Upload Project SOW
            </FormLabel>
            <Controller
              name="documents"
              control={control}
              rules={{ required: 'This is required field' }}
              render={({ field, fieldState }) => {
                return (
                  <VStack alignItems="baseline">
                    <Box>
                      <ChooseFileField
                        name={field.name}
                        value={field.value ? field.value?.name : 'Choose File'}
                        isError={!!fieldState.error?.message}
                        onChange={(file: any) => {
                          onFileChange(file)
                          field.onChange(file)
                        }}
                        onClear={() => setValue(field.name, null)}
                      ></ChooseFileField>
                      <FormErrorMessage>{fieldState.error?.message}</FormErrorMessage>
                    </Box>
                    {field.value && (
                      <Box>{downloadDocument(document, field.value ? field.value?.name : 'doc.png')}</Box>
                    )}
                  </VStack>
                )
              }}
            />
            {/* <FormFileInput
              errorMessage={errors.documents && errors.documents?.message}
              label={''}
              name={`documents`}
              register={register}
              rules={{ required: 'This is required field' }}
            >
              <Button bg="none" rounded="none" roundedLeft={5} fontSize={14} fontWeight={500} h="37px" color="#4A5568">
                {'ChooseFile'}
              </Button> 
            </FormFileInput> */}
          </FormControl>
        </GridItem>
      </Grid>
      <Grid display="flex" position={'absolute'} right={10} bottom={5}>
        <Button variant="outline" colorScheme="brand" onClick={props.onClose}>
          {'Cancel'}
        </Button>
        <Button
          disabled={!props.buttonCondition}
          colorScheme="CustomPrimaryColor"
          size="md"
          ml="3"
          onClick={props.setNextTab}
        >
          {'Next'}
        </Button>
      </Grid>
    </>
  )
})
