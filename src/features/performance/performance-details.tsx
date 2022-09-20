import {
  Box,
  Divider,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useCallback, useEffect } from 'react'
import { Performance } from 'types/performance.type'
import { useUserProfile } from 'utils/redux-common-selectors'
import { useFPMProfile } from 'api/vendor-details'
import { Account } from 'types/account.types'
import PerformanceGraph from 'pages/fpm/graph-performance'
import PerformanceModal from './performance-modal'
import { Button } from 'components/button/button'
import { Card } from 'components/card/card'

const PerformanceDetails = ({
  PerformanceDetails,
  onClose: close,
}: {
  PerformanceDetails: Performance
  onClose: () => void
}) => {
  const { id } = useUserProfile() as Account
  const { data: fpmInformationData, isLoading } = useFPMProfile(id)
  const chart = fpmInformationData

  const { t } = useTranslation()
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
  }, [close, onCloseDisclosure])

  console.log('PerformanceDetails', PerformanceDetails)

  useEffect(() => {
    if (PerformanceDetails) {
      onOpen()
    } else {
      onCloseDisclosure()
    }
  }, [onCloseDisclosure, onOpen, PerformanceDetails])
  return (
    <div>
      <Modal size="3xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8">
          <ModalHeader h="63px" borderBottom="1px solid #E2E8F0" color="gray.600" fontSize={16} fontWeight={500}>
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text lineHeight="22px" h="22px" pr={2}>
                  {PerformanceDetails?.name}
                </Text>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody justifyContent="center">
            <PerformanceModal PerformanceDetails={PerformanceDetails} onClose={onClose} />
            <Card mt={5} overflow={'auto'} height={'300px'}>
              <FormLabel variant={'strong-label'} mb={5} textAlign={'center'}>
                {'Performance per Month'}
              </FormLabel>
              <Box mt={10}>
                <PerformanceGraph chartData={chart} isLoading={isLoading} />
              </Box>
            </Card>
          </ModalBody>
          <Divider mt={3} />
          <ModalFooter>
            <Button variant="outline" colorScheme="brand" onClick={onClose} mr={2}>
              {t('cancel')}
            </Button>
            <Button colorScheme="brand" onClick={onClose} isDisabled>
              {t('save')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default PerformanceDetails
