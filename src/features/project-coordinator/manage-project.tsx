import React, { useCallback } from 'react'
import { Button, FormControl, Grid, GridItem } from '@chakra-ui/react'
import { FormInput } from 'components/react-hook-form-fields/input'
import { useForm } from 'react-hook-form'
import { FormSelect } from 'components/react-hook-form-fields/select'
import { useClients, useFPM, usePC, useSaveProjectDetails } from 'utils/pc-projects'
import { ProjectFormValues } from 'types/project.type'
import { useToast } from '@chakra-ui/react'

export const ManageProject: React.FC<{
  isLoading: boolean
}> = () => {
  // const [showModal, setShowModal] = useState(false)
  const toast = useToast()
  const { mutate: saveProjectDetails } = useSaveProjectDetails()

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
    handleSubmit,
    control,
    watch,
  } = useForm<ProjectFormValues>()

  /* debug purpose */
  const watchAllFields = watch()
  React.useEffect(() => {
    const subscription = watch(value => {
      console.log('Value Change', value)
    })
    return () => subscription.unsubscribe()
  }, [watch, watchAllFields])

  return (
    <>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'}>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={errors.projectManager && errors.projectManager?.message}
              label={'Field Project Manager'}
              name={`projectManager`}
              control={control}
              options={FPMs}
              rules={{ required: 'This is required field' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
            />
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={errors.projectCoordinator && errors.projectCoordinator?.message}
              label={'Project Coordinator'}
              name={`projectCoordinator`}
              control={control}
              options={PCs}
              rules={{ required: 'This is required field' }}
            />
          </FormControl>
        </GridItem>
      </Grid>
      <Grid templateColumns="repeat(4, 215px)" gap={'1rem 1.5rem'} py="3">
        <GridItem>
          <FormControl>
            <FormSelect
              errorMessage={errors.clientName && errors.clientName?.message}
              label={'Client'}
              name={`clientName`}
              control={control}
              options={clients}
              rules={{ required: 'This is required field' }}
              elementStyle={{ bg: 'gray.50', borderLeft: '1.5px solid #4E87F8' }}
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
        <Button
          // onClick={onClose}
          variant="outline"
          size="md"
          color="#4E87F8"
          border="2px solid #4E87F8"
        >
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
