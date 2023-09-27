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
import Status, { STATUS } from 'features/common/status'

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
             <Status value={projectData?.projectStatus as any} id={projectData?.projectStatus as any} />
          </HStack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody  bg='#F2F3F4' p="10px" pt='0px !important' minH="450px">
          {isLoading && <ViewLoader />}
          
          <ProjectDetailsTab
            isRecievable={true}
            style={{ marginLeft: '32px', marginRight: '32px', backgroundColor: '#F7FAFC', height: '520px', pt: "5px"  }}
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
