import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiDetail, BiTrash } from 'react-icons/bi'
import { useAuth } from 'utils/auth-context'
import { dateFormat } from 'utils/date-time-utils'
import { PROJECT_TYPE } from 'features/project-type/project-type.i18n'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'
import { LOCATION } from './location.i18n'
import { useCreateLocation, useDeleteLocation, useUpdateLocation } from 'api/location'
import { ConfirmationBox } from 'components/Confirmation'

const ReadonlyFileStructure: React.FC<{ label: string; value: string; icons: React.ElementType; testid: string }> = ({
  label,
  value,
  icons,
  testid,
}) => {
  const { t } = useTranslation()
  return (
    <HStack spacing={4}>
      <Box h="37px">
        <Icon as={icons} fontSize={20} color="gray.500" />
      </Box>
      <Box w="135px">
        <Text fontWeight={500} fontSize="14px" color="gray.600" isTruncated title={t(`${PROJECT_TYPE}.${label}`)}>
          {t(`${PROJECT_TYPE}.${label}`)}
        </Text>
        <Text fontWeight={400} fontSize="14px" color="gray.500" h="18px" isTruncated title={value} data-testid={testid}>
          {value}
        </Text>
      </Box>
    </HStack>
  )
}

export type ProjectTypeFormTypes = {
  onClose: () => void
  location?: any
  isOpen: boolean
}

export const LocationModal: React.FC<ProjectTypeFormTypes> = ({ onClose: close, location, isOpen }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setValue, watch, reset,setError,clearErrors, formState: { errors }  } = useForm()
  const { mutate: createLocation, isLoading: loadingNewLocation } = useCreateLocation()
  const { mutate: editLocation, isLoading: loadingEditLocation } = useUpdateLocation()
  const { mutate: delLocation ,isLoading: loadingDel} = useDeleteLocation()
  const { data } = useAuth()
  const watchLocation = watch('location')
  const Loading = loadingNewLocation || loadingEditLocation
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('LOCATION.READ')
  const { isOpen: isOpenDeleteLocation, onOpen, onClose: onCloseDisclosure } = useDisclosure()
 
  const onClose = useCallback(() => {
    close()
  }, [close])
  const deleteLocation = () => {
    delLocation(location, {
      onSuccess: () => {
        onCloseDisclosure()
        onClose()
      },
    })
  }

  const onSubmit = value => {
    if (location) {
      const editPayload = {
        createdBy: location?.createdBy,
        createdDate: location?.createdDate,
        id: location?.id,
        modifiedDate: null,
        modifiedBy: '',
        lastModifiedBy:
          watchLocation === location?.value
            ? location?.lastModifiedBy
            : `${data?.user?.firstName} ${data?.user?.lastName}`,
        lastModifiedDate: watchLocation === location?.value ? location?.lastModifiedDate : new Date().toISOString(),
        value: value.location?.replace(/\s+/g, ' ').trim(),
      }

      editLocation(editPayload, { onSuccess: () => onClose() })
    } else {
      const payload = {
        createdBy: `${data?.user?.firstName} ${data?.user?.lastName}`,
        value: value.location?.replace(/\s+/g, ' ').trim(),
        createdDate: new Date().toISOString(),
        id: location?.id,
      }
      createLocation(payload, {
        onSuccess: () => {
          onClose()
          reset()
        },
      })
    }
  }

  useEffect(() => {
    if (location) {
      setValue('location', location?.value)
    }
  }, [location])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent borderTop="2px solid #4E87F8" rounded={0}>
        <ModalHeader borderBottom="1px solid #E2E8F0">
          <FormLabel variant="strong-label" m={0}>
            {location ? t(`${LOCATION}.editLocation`) : t(`${LOCATION}.newLocation`)}
          </FormLabel>
        </ModalHeader>
        <ModalCloseButton
          onClick={() => {
            onClose()
            reset()
          }}
        />
        {Loading && <Progress isIndeterminate colorScheme="blue" aria-label="loading" size="xs" />}
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody p={0}>
            <Box>
              <Box px={5}>
                {location && (
                  <HStack h="100px" borderBottom="1px solid #E2E8F0">
                    <ReadonlyFileStructure
                      label={'createdBy'}
                      value={location?.createdBy}
                      icons={BiDetail}
                      testid="createdBy"
                    />
                    <ReadonlyFileStructure
                      label={'createdDate'}
                      value={dateFormat(location?.createdDate)}
                      icons={BiCalendar}
                      testid="createdDate"
                    />
                    <ReadonlyFileStructure
                      label={'modifiedBy'}
                      value={location?.lastModifiedBy}
                      icons={BiDetail}
                      testid="modifiedBy"
                    />
                    <ReadonlyFileStructure
                      label={'modifiedDate'}
                      value={dateFormat(location?.lastModifiedDate)}
                      icons={BiCalendar}
                      testid="modifiedDate"
                    />
                  </HStack>
                )}
                <Box w="215px" mt="30px">
                  <FormControl isInvalid={!!errors?.location}>
                  <FormLabel variant="strong-label">{t(`${LOCATION}.location`)}</FormLabel>
                  <Input
                    type="text"
                    variant="required-field"
                    {...register('location',{
                      maxLength: { value: 255, message: 'Please use 255 characters only.' },
                    })}
                    onChange={e => {
                      const title = e?.target.value
                      setValue('location', title)
                      if (title?.length > 255) {
                        setError('location', {
                          type: 'maxLength',
                          message: 'Please use 255 characters only.',
                        })
                      } else {
                        clearErrors('location')
                      }
                    }}
                    data-testid="location"
                    isDisabled={isReadOnly}
                  />
                   {!!errors?.location && (
                      <FormErrorMessage data-testid="location_error">{errors?.location?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter  borderTop="1px solid #E2E8F0" mt="30px" justifyContent="space-between">
          <HStack spacing="16px">
                {!isReadOnly && location && (
                  <Button
                    data-testid="delete-Location-btn"
                    variant="outline"
                    colorScheme="brand"
                    onClick={onOpen}
                    leftIcon={<BiTrash />}
                  >
                    {t(`${LOCATION}.delete`)}
                  </Button>
                )}
              </HStack>
            <HStack w="100%" justifyContent="end">
              <Button
                variant="outline"
                colorScheme="brand"
                onClick={() => {
                  onClose()
                  reset()
                }}
                data-testid="cancelModal"
              >
                {t(`${LOCATION}.cancel`)}
              </Button>
              {!isReadOnly && (
                <Button
                  isDisabled={!watchLocation || watchLocation.trim() === '' || Loading}
                  colorScheme="brand"
                  type="submit"
                  data-testid="saveLocation"
                >
                  {t(`${LOCATION}.save`)}
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </form>
        {isOpenDeleteLocation && (
        <ConfirmationBox
          title="Location"
          content={t(`${LOCATION}.delConfirmText`)}
          isOpen={isOpenDeleteLocation}
          onClose={onCloseDisclosure}
          isLoading={loadingDel}
          onConfirm={deleteLocation}
        />
        )}
      </ModalContent>
    </Modal>
  )
}
