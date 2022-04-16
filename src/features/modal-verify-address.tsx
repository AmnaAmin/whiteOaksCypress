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
  Text,
  Flex,
  Input,
  GridItem,
  Grid,
  Checkbox,
} from '@chakra-ui/react'
import { Label } from 'recharts'
import { Row } from 'components/table/react-table'
import { useVerifyAddressApi } from 'utils/pc-projects'

interface VerifyAddressBoxProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  save: () => void
  title: string
  content: string
  props: string
  addressVerificationStatus: string
}

export function ModalVerifyAddress({
  isOpen,
  isLoading = false,
  onClose,
  // onConfirm,
  title,
  content,
  props,
  addressVerificationStatus,
}: VerifyAddressBoxProps) {
  const [closeModal, setCloseModal] = useState(isOpen)
  const [continueUnverified, setContinueUnverified] = useState(false)
  const toggleSubModal = () => props

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered={true} closeOnEsc={false} closeOnOverlayClick={false} size="lg">
      <ModalOverlay />
      <ModalContent rounded="6">
        <ModalHeader
          borderBottom="2px solid #E2E8F0"
          fontWeight={500}
          color="gray.600"
          fontSize="16px"
          fontStyle="normal"
          mb="5"
        >
          {title}
        </ModalHeader>
        <ModalCloseButton color="gray.700" _focus={{ border: 'none' }} />
        <ModalBody>
          <Grid>
            <GridItem>
              {addressVerificationStatus === 'verifying' && (
                <div className="uspsAdressVerification">
                  <h5>Verifying address with USPS...</h5>
                </div>
              )}

              {addressVerificationStatus === 'failed' && (
                <div className="uspsAdressVerificationFailed">
                  <h5>Address verification failed! Please fix the address and try again</h5>
                </div>
              )}
              {addressVerificationStatus === 'success' && (
                <div className="uspsAdressVerificationSuccess">
                  <h5>Address verification Passed</h5>
                </div>
              )}
            </GridItem>
            <GridItem>
              <div>
                {addressVerificationStatus === 'verifying' && (
                  <img src="content/images/spinner.gif" className="spinner" />
                )}
                {addressVerificationStatus === 'failed' && <img src="content/images/failed.png" className="spinner" />}
                {addressVerificationStatus === 'success' && (
                  <img src="content/images/checkmark.gif" className="spinner" />
                )}
              </div>
            </GridItem>
          </Grid>
        </ModalBody>
        <ModalFooter className="FooterSpaceBetween custom-modal">
          <Checkbox
            type="checkbox"
            className="mr-1"
            position={'absolute'}
            left="25px"
            // onChange={setContinueUnverified}
            // value={continueUnverified}
          >
            Continue with unverified address
          </Checkbox>
          <div className="d-flex align-items-center">
            <Button
              color="primary"
              id="save-entity"
              // onClick={}
              disabled={!continueUnverified || addressVerificationStatus === 'verifying'}
              className="btn btn-primary jh-create-entity "
            >
              {/* <SaveRoundedIcon /> */}
              Save
            </Button>
            <Button color="secondary" onClick={toggleSubModal} className="ml-2">
              Close
            </Button>
          </div>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
