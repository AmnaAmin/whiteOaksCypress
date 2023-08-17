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
import { useProjectTypeEditMutation, useProjectTypeMutation, useProjTypeDelMutation } from 'api/project-type'
import { ConfirmationBox } from 'components/Confirmation'
import { useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { BiCalendar, BiDetail, BiTrash } from 'react-icons/bi'
import { useAuth } from 'utils/auth-context'
import { dateFormat } from 'utils/date-time-utils'
import { PROJECT_TYPE } from './project-type.i18n'

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
  projectTypeDetails?: any
  isOpen: boolean
}

export const ProjectTypeModal: React.FC<ProjectTypeFormTypes> = ({ onClose: close, projectTypeDetails, isOpen }) => {
  const { t } = useTranslation()
  const { register, handleSubmit, setValue, watch, reset } = useForm()
  const { mutate: projectTypePayload, isLoading } = useProjectTypeMutation()
  const { mutate: delProjType, isLoading: loadingDel } = useProjTypeDelMutation()
  const { mutate: projectTypeEditPayload, isLoading: loading } = useProjectTypeEditMutation()
  const { data } = useAuth()
  const typeFieldWatch = watch('type')
  const Loading = isLoading || loading
  const { isOpen: isOpenProjType, onOpen, onClose: onCloseDisclosure } = useDisclosure()

  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  const deleteProjectType = () => {
    delProjType(projectTypeDetails, { onSuccess: () => onClose() })
  }

  const onSubmit = value => {
    if (projectTypeDetails) {
      const editPayload = {
        createdBy: projectTypeDetails?.createdBy,
        createdDate: projectTypeDetails?.createdDate,
        id: projectTypeDetails?.id,
        modifiedDate: null,
        modifiedBy: '',
        lastModifiedBy: projectTypeDetails?.lastModifiedBy,
        lastModifiedDate:
          typeFieldWatch === projectTypeDetails?.value
            ? projectTypeDetails?.lastModifiedDate
            : new Date().toISOString(),
        value: value.type,
      }
      projectTypeEditPayload(editPayload, { onSuccess: () => onClose() })
    } else {
      const payload = {
        createdBy: `${data?.user?.firstName} ${data?.user?.lastName}`,
        value: value.type,
        createdDate: new Date().toISOString(),
        id: projectTypeDetails?.id,
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
    if (projectTypeDetails) {
      setValue('type', projectTypeDetails?.value)
    }
  }, [projectTypeDetails])

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl" isCentered>
      <ModalOverlay />
      <ModalContent borderTop="2px solid #4E87F8" rounded={0}>
        <ModalHeader borderBottom="1px solid #E2E8F0">
          <FormLabel variant="strong-label" m={0}>
            {projectTypeDetails ? t(`${PROJECT_TYPE}.editProjectType`) : t(`${PROJECT_TYPE}.newProjectType`)}
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
                {projectTypeDetails && (
                  <HStack h="100px" borderBottom="1px solid #E2E8F0">
                    <ReadonlyFileStructure
                      label={'createdBy'}
                      value={projectTypeDetails?.createdBy}
                      icons={BiDetail}
                      testid="createdBy"
                    />
                    <ReadonlyFileStructure
                      label={'createdDate'}
                      value={dateFormat(projectTypeDetails?.createdDate)}
                      icons={BiCalendar}
                      testid="createdDate"
                    />
                    <ReadonlyFileStructure
                      label={'modifiedBy'}
                      value={projectTypeDetails?.lastModifiedBy}
                      icons={BiDetail}
                      testid="modifiedBy"
                    />
                    <ReadonlyFileStructure
                      label={'modifiedDate'}
                      value={dateFormat(projectTypeDetails?.lastModifiedDate)}
                      icons={BiCalendar}
                      testid="modifiedDate"
                    />
                  </HStack>
                )}
                <Box w="215px" mt="30px">
                  <FormLabel variant="strong-label">{t(`${PROJECT_TYPE}.type`)}</FormLabel>
                  <Input
                    type="text"
                    variant="required-field"
                    {...register('type')}
                    title={typeFieldWatch}
                    data-testid="type"
                  />
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter borderTop="1px solid #E2E8F0" mt="40px">
            <HStack justifyContent="start" w="100%">
              {projectTypeDetails && (
                <Button variant="outline" colorScheme="brand" size="md" onClick={onOpen} leftIcon={<BiTrash />}>
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
              <Button
                isDisabled={!typeFieldWatch  || typeFieldWatch.trim() === ''|| Loading}
                colorScheme="brand"
                type="submit"
                data-testid="saveProjectType"
              >
                {t(`${PROJECT_TYPE}.save`)}
              </Button>
            </HStack>
          </ModalFooter>
        </form>
        <ConfirmationBox
          title="Project Type"
          content={t(`${PROJECT_TYPE}.delConfirmText`)}
          isOpen={isOpenProjType}
          onClose={onCloseDisclosure}
          isLoading={loadingDel}
          onConfirm={deleteProjectType}
        />
      </ModalContent>
    </Modal>
  )
}
