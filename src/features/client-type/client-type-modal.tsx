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
import { ConfirmationBox } from 'components/Confirmation'
import { useClientTypeEditMutation, useClientTypeMutation, useClientTypeDelMutation } from 'api/client-type'
import { PROJECT_TYPE } from 'features/project-type/project-type.i18n'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

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
  clientTypeDetails?: any
  isOpen: boolean
}

export const ClientTypeModal: React.FC<ProjectTypeFormTypes> = ({ onClose: close, clientTypeDetails, isOpen }) => {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm()
  const { mutate: clientTypePayload, isLoading: loadingNewClient } = useClientTypeMutation()
  const { mutate: clientTypeEditPayload, isLoading: loadingEditClient } = useClientTypeEditMutation()
  const { mutate: delClientType, isLoading: loadingDel } = useClientTypeDelMutation()
  const { data } = useAuth()
  const typeFieldWatch = watch('type')
  const Loading = loadingEditClient || loadingNewClient
  const { isOpen: isOpenClientType, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('CLIENTTYPE.READ')

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  const deleteClientType = () => {
    delClientType(clientTypeDetails, { onSuccess: () => onClose() })
  }

  const onSubmit = value => {
    if (clientTypeDetails) {
      const editPayload = {
        createdBy: clientTypeDetails?.createdBy,
        createdDate: clientTypeDetails?.createdDate,
        id: clientTypeDetails?.id,
        modifiedDate: null,
        modifiedBy: '',
        lastModifiedBy: clientTypeDetails?.modifiedBy,
        lastModifiedDate:
          typeFieldWatch === clientTypeDetails?.value ? clientTypeDetails?.lastModifiedDate : new Date().toISOString(),
        value: value.type,
      }

      clientTypeEditPayload(editPayload, { onSuccess: () => onClose() })
    } else {
      const payload = {
        createdBy: `${data?.user?.firstName} ${data?.user?.lastName}`,
        value: value.type,
        createdDate: new Date().toISOString(),
        id: clientTypeDetails?.id,
      }
      clientTypePayload(payload, {
        onSuccess: () => {
          onClose()
          reset()
        },
      })
    }
  }

  useEffect(() => {
    if (clientTypeDetails) {
      setValue('type', clientTypeDetails?.value)
    }
  }, [clientTypeDetails])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent borderTop="2px solid #4E87F8" rounded={0}>
        <ModalHeader borderBottom="1px solid #E2E8F0">
          <FormLabel variant="strong-label" m={0}>
            {clientTypeDetails ? t(`${PROJECT_TYPE}.editClientType`) : t(`${PROJECT_TYPE}.newClientType`)}
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
                {clientTypeDetails && (
                  <HStack h="100px" borderBottom="1px solid #E2E8F0">
                    <ReadonlyFileStructure
                      label={'createdBy'}
                      value={clientTypeDetails?.createdBy}
                      icons={BiDetail}
                      testid="createdBy"
                    />
                    <ReadonlyFileStructure
                      label={'createdDate'}
                      value={dateFormat(clientTypeDetails?.createdDate)}
                      icons={BiCalendar}
                      testid="createdDate"
                    />
                    <ReadonlyFileStructure
                      label={'modifiedBy'}
                      value={clientTypeDetails?.modifiedBy}
                      icons={BiDetail}
                      testid="modifiedBy"
                    />
                    <ReadonlyFileStructure
                      label={'modifiedDate'}
                      value={dateFormat(clientTypeDetails?.modifiedDate)}
                      icons={BiCalendar}
                      testid="modifiedDate"
                    />
                  </HStack>
                )}
                <Box w="215px" mt="30px">
                  <FormControl isInvalid={!!errors?.type}>
                    <FormLabel variant="strong-label">{t(`${PROJECT_TYPE}.type`)}</FormLabel>
                    <Input
                      type="text"
                      variant="required-field"
                      {...register('type', {
                        maxLength: { value: 255, message: 'Please use 255 characters only.' },
                      })}
                      title={typeFieldWatch}
                      data-testid="type"
                      isDisabled={isReadOnly}
                      onChange={e => {
                        const title = e?.target.value
                        setValue('type', title)
                        if (title?.length > 255) {
                          setError('type', {
                            type: 'maxLength',
                            message: 'Please use 255 characters only.',
                          })
                        } else {
                          clearErrors('type')
                        }
                      }}
                    />
                    {!!errors?.type && (
                      <FormErrorMessage data-testid="clientType_error">{errors?.type?.message}</FormErrorMessage>
                    )}
                  </FormControl>
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter borderTop="1px solid #E2E8F0" mt="40px">
            <HStack w="100%" justifyContent="start">
              {clientTypeDetails && !isReadOnly && (
                <Button
                  variant="outline"
                  colorScheme="brand"
                  leftIcon={<BiTrash />}
                  mr={3}
                  onClick={() => {
                    onOpen()
                  }}
                  data-testid="deleteModal"
                >
                  {t(`${PROJECT_TYPE}.deleteType`)}
                </Button>
              )}
            </HStack>
            <HStack w="100%" justifyContent="end">
              <Button
                variant="outline"
                colorScheme="brand"
                mr={3}
                onClick={() => {
                  onClose()
                  reset()
                }}
                data-testid="cancelModal"
              >
                {t(`${PROJECT_TYPE}.cancel`)}
              </Button>
              {!isReadOnly && (
                <Button
                  isDisabled={!typeFieldWatch || typeFieldWatch.trim() === '' || Loading}
                  colorScheme="brand"
                  type="submit"
                  data-testid="saveProjectType"
                >
                  {t(`${PROJECT_TYPE}.save`)}
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </form>
        <ConfirmationBox
          title="Client Type"
          content={t(`${PROJECT_TYPE}.delConfirmTextClient`)}
          isOpen={isOpenClientType}
          onClose={onCloseDisclosure}
          isLoading={loadingDel}
          onConfirm={deleteClientType}
        />
      </ModalContent>
    </Modal>
  )
}
