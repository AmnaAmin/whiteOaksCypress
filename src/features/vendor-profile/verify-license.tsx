import { useState, useEffect } from 'react'
import { Divider, HStack, Icon, Text, Flex, Checkbox } from '@chakra-ui/react'
import { BiCheckSquare } from 'react-icons/bi'
import { AiFillExclamationCircle } from 'react-icons/ai'

enum VERIFICATION_STATUS {
  VERIFIED = 'VERIFIED',
  EXPIRED = 'EXPIRED',
  UNVERIFIED = 'UNVERIFIED',
}

interface AdminVerifyLicenseProps {
  currStatus: any
  fieldName: string
  registerToFormField: any
}

export const AdminPortalVerifyLicense = (props: AdminVerifyLicenseProps): JSX.Element => {
  const [verificationStatus] = useState<VERIFICATION_STATUS>(props.currStatus)

  useEffect(() => {}, [])

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

interface VendorPortalLicenseProps {
  currStatus: any
}

export const VendorPortalVerifyLicense = (props: VendorPortalLicenseProps): JSX.Element => {
  const [verificationStatus] = useState<VERIFICATION_STATUS>(props.currStatus)

  useEffect(() => {}, [])

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
