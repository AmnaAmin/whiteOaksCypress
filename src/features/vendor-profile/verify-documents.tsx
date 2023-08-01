import { useState, useEffect } from 'react'
import { Divider, HStack, Icon, Text, Flex, Checkbox } from '@chakra-ui/react'
import { BiCheckSquare } from 'react-icons/bi'
import { AiFillExclamationCircle } from 'react-icons/ai'
import { VendorProfile } from 'types/vendor.types'
import { UseFormRegister } from 'react-hook-form'
import { useRoleBasedPermissions } from 'utils/redux-common-selectors'

interface NewVendorProfile extends VendorProfile {
  coiGLStatus: string | null
  coiWCStatus: string | null
  agreementSignedStatus: string | null
  autoInsuranceStatus: string | null
  w9Status: string | null
}

interface VendorPortalVerifyDocumentProps {
  vendor: NewVendorProfile
  fieldName: string
}

enum VERIFICATION_STATUS {
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
  UNVERIFIED = 'UNVERIFIED',
}

export const VendorPortalVerifyDocument = (props: VendorPortalVerifyDocumentProps): JSX.Element => {
  const [verificationStatus, setVerificationStatus] = useState<VERIFICATION_STATUS>(VERIFICATION_STATUS.UNVERIFIED)

  useEffect(() => {
    if (props.fieldName === 'CoiWcExp') {
      if (props.vendor.coiWCStatus === null || props.vendor.coiWCStatus === VERIFICATION_STATUS.UNVERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor.coiWCStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor.coiWCStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }

    if (props.fieldName === 'coiGLExp') {
      if (props.vendor.coiGLStatus === null || props.vendor.coiGLStatus === VERIFICATION_STATUS.UNVERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor.coiGLStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor.coiGLStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }

    if (props.fieldName === 'autoInsurance') {
      if (
        props.vendor.autoInsuranceStatus === null ||
        props.vendor.autoInsuranceStatus === VERIFICATION_STATUS.UNVERIFIED
      ) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor.autoInsuranceStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor.autoInsuranceStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }

    if (props.fieldName === 'agreementSign') {
      if (
        props.vendor.agreementSignedStatus === null ||
        props.vendor.agreementSignedStatus === VERIFICATION_STATUS.UNVERIFIED
      ) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor.agreementSignedStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor.agreementSignedStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }

    if (props.fieldName === 'W9Document') {
      if (props.vendor.w9Status === null || props.vendor.w9Status === VERIFICATION_STATUS.UNVERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor.w9Status === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor.w9Status === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }
    if (props.fieldName === 'bankVoidedCheckStatus') {
      if (
        props.vendor.bankVoidedCheckStatus === null ||
        props.vendor.bankVoidedCheckStatus === VERIFICATION_STATUS.UNVERIFIED
      ) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor.bankVoidedCheckStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor.bankVoidedCheckStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }
  }, [props.vendor])

  return (
    <>
      <HStack pt="10px" spacing={{ base: 0, sm: '0.5rem' }}>
        <Divider
          orientation="vertical"
          border="1px solid #CBD5E0 !important"
          h="20px"
          display={{ base: 'none', sm: 'block' }}
        />
        {verificationStatus === VERIFICATION_STATUS.VERIFIED && (
          <Flex bgColor="#E7F8EC" borderRadius="6px" p="5px">
            <Text fontSize="14px" lineHeight="20px" color="#48BB78">
              <Icon as={BiCheckSquare} position="relative" top="2px" /> Verified
            </Text>
          </Flex>
        )}
        {verificationStatus === VERIFICATION_STATUS.EXPIRED && (
          <Flex bgColor="#FFF5F5" borderRadius="6px" p="5px">
            <Text fontSize="14px" lineHeight="20px" color="#F56565">
              <Icon as={AiFillExclamationCircle} position="relative" top="2px" /> Expired
            </Text>
          </Flex>
        )}
        {verificationStatus === VERIFICATION_STATUS.UNVERIFIED && (
          <Flex bgColor="#EDF2F7" borderRadius="6px" p="5px">
            <Text fontSize="14px" lineHeight="20px" color="#A0AEC0">
              <Icon as={BiCheckSquare} position="relative" top="2px" /> Unverified
            </Text>
          </Flex>
        )}
      </HStack>
    </>
  )
}

interface AdminVerifyDocumentProps {
  vendor: NewVendorProfile
  fieldName: string
  registerToFormField: UseFormRegister<any>
}

export const AdminPortalVerifyDocument = (props: AdminVerifyDocumentProps): JSX.Element => {
  const [verificationStatus, setVerificationStatus] = useState<VERIFICATION_STATUS>(VERIFICATION_STATUS.UNVERIFIED)
  const isReadOnly = useRoleBasedPermissions()?.permissions?.includes('VENDOR.READ')

  useEffect(() => {
    if (props.fieldName === 'CoiWcExpCheckbox') {
      if (props.vendor?.coiWCStatus === null || props.vendor?.coiWCStatus === VERIFICATION_STATUS.UNVERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor?.coiWCStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor?.coiWCStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }

    if (props.fieldName === 'coiGLExpCheckBox') {
      if (props.vendor?.coiGLStatus === null || props.vendor?.coiGLStatus === VERIFICATION_STATUS.UNVERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor?.coiGLStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor?.coiGLStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }

    if (props.fieldName === 'autoInsuranceCheckBox') {
      if (
        props.vendor?.autoInsuranceStatus === null ||
        props.vendor?.autoInsuranceStatus === VERIFICATION_STATUS.UNVERIFIED
      ) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor?.autoInsuranceStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor?.autoInsuranceStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }

    if (props.fieldName === 'agreementSignCheckBox') {
      if (
        props.vendor?.agreementSignedStatus === null ||
        props.vendor?.agreementSignedStatus === VERIFICATION_STATUS.UNVERIFIED
      ) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor?.agreementSignedStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor?.agreementSignedStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }

    if (props.fieldName === 'W9DocumentCheckBox') {
      if (props.vendor?.w9Status === null || props.vendor?.w9Status === VERIFICATION_STATUS.UNVERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor?.w9Status === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor?.w9Status === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }
    if (props.fieldName === 'bankVoidedCheckStatus') {
      if (
        props.vendor?.bankVoidedCheckStatus === null ||
        props.vendor?.bankVoidedCheckStatus === VERIFICATION_STATUS.UNVERIFIED
      ) {
        setVerificationStatus(VERIFICATION_STATUS.UNVERIFIED)
      }

      if (props.vendor?.bankVoidedCheckStatus === VERIFICATION_STATUS.EXPIRED) {
        setVerificationStatus(VERIFICATION_STATUS.EXPIRED)
      }

      if (props.vendor?.bankVoidedCheckStatus === VERIFICATION_STATUS.VERIFIED) {
        setVerificationStatus(VERIFICATION_STATUS.VERIFIED)
      }
    }
  }, [props.vendor])

  return (
    <>
      <HStack py="25px">
        <Divider orientation="vertical" border="1px solid #CBD5E0 !important" h="20px" />
        {verificationStatus === VERIFICATION_STATUS.VERIFIED && (
          <Flex bgColor="#E7F8EC" borderRadius="6px" p="5px">
            <Text fontSize="14px" lineHeight="20px" color="#48BB78">
              <Icon as={BiCheckSquare} position="relative" top="2px" /> Verified
            </Text>
          </Flex>
        )}
        {verificationStatus === VERIFICATION_STATUS.EXPIRED && (
          <Flex bgColor="#FFF5F5" borderRadius="6px" p="5px">
            <Text fontSize="14px" lineHeight="20px" color="#F56565">
              <Icon as={AiFillExclamationCircle} position="relative" top="2px" /> Expired
            </Text>
          </Flex>
        )}
        {verificationStatus === VERIFICATION_STATUS.UNVERIFIED && (
          <Checkbox
            color="#E2E8F0"
            //bgColor="#FFFFFF"
            //borderColor="#E2E8F0"
            // borderWidth="2px"
            isDisabled={isReadOnly}
            {...props.registerToFormField(props.fieldName as any)}
          >
            <Text fontSize="14px" lineHeight="20px" color="#718096">
              Verify
            </Text>
          </Checkbox>
        )}
      </HStack>
    </>
  )
}
