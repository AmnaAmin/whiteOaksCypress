import {
  Text,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Divider,
  Tag,
} from '@chakra-ui/react'
import { ViewLoader } from 'components/page-level-loader'
import ProjectDetailsTab from 'features/update-project-details/project-details-form'
import React, { useEffect } from 'react'
import { Project } from 'types/project.type'
import { usePCProject } from 'api/pc-projects'
import { STATUS } from 'features/common/status'

const AccountReceivableModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  projectId?: string
}> = props => {
  const { projectData, isLoading } = usePCProject(props?.projectId?.toString())

  useEffect(() => {
    if (projectData && ![STATUS.Invoiced].includes(projectData?.projectStatus?.toLocaleLowerCase() as STATUS)) {
      props?.onClose()
    }
  }, [projectData])

  return (
    <Modal onClose={props.onClose} size="5xl" isOpen={props.isOpen} variant="custom">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <HStack spacing="3">
            <Text>ID {projectData?.id} </Text>
            <Divider orientation="vertical" borderWidth="1px" borderColor="#E2E8F0" height="21px" />
            <Text>{projectData?.streetAddress}</Text>
            <Tag variant="subtle" color="#48BB78" bg="#E2EFDF">
              Invoice
            </Tag>
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p="1.7px" minH="450px">
          {isLoading && <ViewLoader />}
          <ProjectDetailsTab
            style={{ marginLeft: '32px', marginRight: '32px', backgroundColor: '#F7FAFC', height: '430px' }}
            tabVariant="enclosed"
            onClose={props.onClose}
            projectData={projectData as Project}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

export default AccountReceivableModal
