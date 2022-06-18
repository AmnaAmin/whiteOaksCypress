import React, { useState } from 'react'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  GridItem,
  Grid,
  Checkbox,
  Box,
} from '@chakra-ui/react'
import FailedIcon from 'icons/failed-icon'
import SuccessIcon from 'icons/success-icon'
import VerifyingIcon from 'icons/verifying-icon'
interface VerifyAddressBoxProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  title: string
  addressVerificationStatus: string
  setNextTab: () => void
  props: any
}

export function ModalVerifyAddress({
  isOpen,
  isLoading = false,
  onClose,
  // onConfirm,
  title,
  addressVerificationStatus,
  props,
}: VerifyAddressBoxProps) {
  const [continueUnverified, setContinueUnverified] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} closeOnEsc={false} closeOnOverlayClick={false} size="xl">
      <ModalOverlay />
      <ModalContent rounded="6">
        <Grid
          height={addressVerificationStatus === 'failed' ? 155 : 100}
          templateRows="repeat(2, 1fr)"
          templateColumns="repeat(5, 1fr)"
        >
          <GridItem
            rowSpan={2}
            colSpan={1}
            bg="#4E87F8"
            roundedLeft={6}
            alignItems={'center'}
            height={addressVerificationStatus === 'failed' ? 155 : 100}
          >
            {addressVerificationStatus === 'verifying' && (
              <Box position={'absolute'} left={38} top={8}>
                <VerifyingIcon />
              </Box>
            )}
            {addressVerificationStatus === 'failed' && (
              <Box position={'absolute'} left={38} top={55}>
                <FailedIcon />
              </Box>
            )}
            {addressVerificationStatus === 'success' && (
              <Box position={'absolute'} left={38} top={8}>
                <SuccessIcon />
              </Box>
            )}
          </GridItem>
          <GridItem colSpan={4}>
            <ModalHeader fontWeight={500} color="gray.600" fontSize="18px" fontStyle="normal" mt="2" mb="-4">
              {title}
            </ModalHeader>
            <ModalCloseButton color="gray.700" _focus={{ border: 'none' }} />
            <ModalBody>
              {addressVerificationStatus === 'verifying' && (
                <Box className="uspsAdressVerification" marginTop={-2}>
                  <h5>Verifying address with USPS</h5>
                </Box>
              )}

              {addressVerificationStatus === 'failed' && (
                <Box className="uspsAdressVerificationFailed" marginTop={-2}>
                  <h5>Address verification failed! Please fix the address & try again</h5>
                </Box>
              )}
              {addressVerificationStatus === 'success' && (
                <>
                  <Box className="uspsAdressVerificationSuccess" marginTop={-2}>
                    <h5>Verified by UPS</h5>
                    <Button
                      bg="none"
                      color="#4E87F8"
                      _hover={{ bg: 'none' }}
                      _focus={{ border: '1px solid #4E87F8' }}
                      fontSize="12px"
                      fontStyle="normal"
                      fontWeight={500}
                      border="1px solid #4E87F8"
                      position="absolute"
                      top="30"
                      right="55"
                      onClick={() => {
                        onClose()
                        props.setNextTab()
                      }}
                    >
                      Continue
                    </Button>
                  </Box>
                </>
              )}
            </ModalBody>
            <ModalFooter className="FooterSpaceBetween custom-modal">
              {addressVerificationStatus === 'failed' && (
                <>
                  <Box position={'absolute'} left={200}>
                    <Button
                      disabled={!continueUnverified}
                      marginRight={3}
                      bg="none"
                      color="#4E87F8"
                      _hover={{ bg: 'none' }}
                      _focus={{ border: '1px solid #4E87F8' }}
                      fontSize="14px"
                      fontStyle="normal"
                      fontWeight={500}
                      width={78}
                      height={30}
                      border="1px solid #4E87F8"
                      onClick={() => {
                        onClose()
                        props.setNextTab()
                      }}
                    >
                      Save
                    </Button>
                    <Checkbox
                      type="checkbox"
                      marginTop={1}
                      onChange={e => setContinueUnverified(e.target.checked)}
                      isChecked={continueUnverified}
                      color="red"
                    >
                      Continue with unverified address
                    </Checkbox>
                  </Box>
                </>
              )}
            </ModalFooter>
          </GridItem>
        </Grid>
      </ModalContent>
    </Modal>
  )
}
