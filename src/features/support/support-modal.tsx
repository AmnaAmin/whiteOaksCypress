import {
  Box,
  Button,
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
import { useProjectTypeEditMutation, useProjectTypeMutation } from 'api/project-type'
import { SUPPORT } from 'features/support/support.i18n'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiDetail } from 'react-icons/bi'
import { useAuth } from 'utils/auth-context'
import { dateFormat } from 'utils/date-time-utils'

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
        <Text fontWeight={500} fontSize="14px" color="gray.600" isTruncated title={t(`${SUPPORT}.${label}`)}>
          {t(`${SUPPORT}.${label}`)}
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
  supportDetail?: any
  isOpen: boolean
}

export const SupportModal: React.FC<ProjectTypeFormTypes> = ({ onClose: close, supportDetail, isOpen }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setValue, watch, reset } = useForm()
  const { mutate: projectTypePayload, isLoading } = useProjectTypeMutation()
  const { mutate: projectTypeEditPayload, isLoading: loading } = useProjectTypeEditMutation()
  const { data } = useAuth()
  const typeFieldWatch = watch('type')
  const Loading = isLoading || loading
  const { onOpen, onClose: onCloseDisclosure } = useDisclosure()

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (supportDetail) {
      onOpen()
    } else {
      onCloseDisclosure()
    }
  }, [onCloseDisclosure, onOpen, supportDetail])

  const onSubmit = value => {
    if (supportDetail) {
      const editPayload = {
        createdBy: supportDetail?.createdBy,
        createdDate: supportDetail?.createdDate,
        id: supportDetail?.id,
        modifiedDate: null,
        modifiedBy: '',
        lastModifiedBy: supportDetail?.lastModifiedBy,
        lastModifiedDate:
          typeFieldWatch === supportDetail?.value ? supportDetail?.lastModifiedDate : new Date().toISOString(),
        value: value.type,
      }
      projectTypeEditPayload(editPayload, { onSuccess: () => onClose() })
    } else {
      const payload = {
        createdBy: `${data?.user?.firstName} ${data?.user?.lastName}`,
        value: value.type,
        createdDate: new Date().toISOString(),
        id: supportDetail?.id,
      }
      projectTypePayload(payload, {
        onSuccess: () => {
          onClose()
          reset()
        },
      })
    }
  }

  useEffect(() => {
    if (supportDetail) {
      setValue('type', supportDetail?.value)
    }
  }, [supportDetail])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent borderTop="2px solid #4E87F8" rounded={0}>
        <ModalHeader borderBottom="1px solid #E2E8F0">
          <FormLabel variant="strong-label" m={0}>
            {supportDetail ? (
              <>
                {t(`${SUPPORT}.id`)} {supportDetail.id} | {t(`${SUPPORT}.editProjectType`)}
              </>
            ) : (
              t(`${SUPPORT}.newProjectType`)
            )}
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
                {supportDetail && (
                  <HStack h="100px" borderBottom="1px solid #E2E8F0">
                    <ReadonlyFileStructure
                      label={'createdBy'}
                      value={supportDetail?.createdBy}
                      icons={BiDetail}
                      testid="createdBy"
                    />
                    <ReadonlyFileStructure
                      label={'createdDate'}
                      value={dateFormat(supportDetail?.createdDate)}
                      icons={BiCalendar}
                      testid="createdDate"
                    />
                    <ReadonlyFileStructure
                      label={'modifiedBy'}
                      value={supportDetail?.lastModifiedBy}
                      icons={BiDetail}
                      testid="modifiedBy"
                    />
                    <ReadonlyFileStructure
                      label={'modifiedDate'}
                      value={dateFormat(supportDetail?.lastModifiedDate)}
                      icons={BiCalendar}
                      testid="modifiedDate"
                    />
                  </HStack>
                )}
                <Box w="215px" mt="30px">
                  <FormLabel variant="strong-label">{t(`${SUPPORT}.type`)}</FormLabel>
                  <Input
                    type="text"
                    borderLeft="2.5px solid #4E87F8"
                    {...register('type')}
                    title={typeFieldWatch}
                    data-testid="type"
                  />
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter borderTop="1px solid #E2E8F0" mt="40px">
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
              {t(`${SUPPORT}.cancel`)}
            </Button>
            <Button
              isDisabled={!typeFieldWatch || Loading}
              colorScheme="brand"
              type="submit"
              data-testid="saveProjectType"
            >
              {t(`${SUPPORT}.save`)}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
