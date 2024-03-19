import {
  Box,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { t } from 'i18next'

import { VendorProfileTabs } from 'pages/vendor/vendor-profile'
import { useVendorProfile } from 'api/vendor-details'
import { useCallback, useEffect } from 'react'
import { useQueryClient } from 'react-query'

const Vendor = ({ vendorId, onClose: close }: { vendorId: number; onClose: () => void }) => {
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure()
  const { data: vendorProfileData, isLoading, refetch } = useVendorProfile(vendorId)

  const queryClient = useQueryClient()
  const onClose = useCallback(() => {
    onCloseDisclosure()
    close()
    queryClient.resetQueries('vendor-users-list')
    queryClient.removeQueries('vendorProfile')
  }, [close, onCloseDisclosure])

  useEffect(() => {
    if (vendorProfileData) {
      onOpen()
    } else {
      onCloseDisclosure()
    }
    queryClient.resetQueries('vendor-users-list')
  }, [onCloseDisclosure, onOpen, vendorProfileData])

  return (
    <div>
      <Modal size="none" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="1237px" rounded="6px" borderTop="2px solid #4E87F8" bg="#F2F3F4">
          <ModalHeader
            h="63px"
            borderBottom="1px solid #E2E8F0"
            color="gray.600"
            fontSize={16}
            fontWeight={500}
            bg="white"
          >
            <HStack spacing={4}>
              <HStack fontSize="16px" fontWeight={500} h="32px">
                <Text borderRight="1px solid #E2E8F0" lineHeight="22px" h="22px" pr={2}>
                  {t('vendorDetail')}
                </Text>
                {!isLoading && <Text lineHeight="22px" h="22px">
                  {vendorProfileData?.companyName}
                </Text>}
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalCloseButton _hover={{ bg: 'blue.50' }} />
          <ModalBody p="15px" px="9px" >
            <Box mt="14px">
              {isLoading ? (
                <BlankSlate width="60px" />
              ) : (
                <VendorProfileTabs
                  vendorId={vendorProfileData?.id}
                  vendorProfileData={vendorProfileData}
                  refetch={refetch}
                  vendorModalType="editVendor"
                  onClose={onClose}
                />
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default Vendor
