import {
  Box,
  Alert,
  AlertIcon,
  AlertDescription,
  Button,
  HStack,
  FormLabel,
  useDisclosure,
  CloseButton,
} from '@chakra-ui/react'
import { useDocumentLicenseMessage } from 'features/vendor-profile/hook'
import { VENDORPROFILE } from 'features/vendor-profile/vendor-profile.i18n'
import { DASHBOARD } from 'features/vendor/dashboard/dashboard.i18n'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { LicenseDocument } from 'types/vendor.types'
import { useInsuranceLicenseErrorMessage } from '../../components/VendorScore/hook'

const CustomAlert: React.FC<{ title: string; tabs?: number; onClose?: () => void; data?: any }> = ({
  title,
  tabs,
  onClose,
  data,
}) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const selectTabs = params => {
    navigate('/vendors', { state: params })
  }
  return (
    <Alert status="error" rounded={6} h="47px" bg="#FFE4E4">
      <AlertIcon />
      <AlertDescription display="flex" justifyContent="space-between" w="100%">
        <HStack>
          <FormLabel m={0} color="#E53E3E">
            {t(`${DASHBOARD ? DASHBOARD : VENDORPROFILE}.${title}`)}
          </FormLabel>
          {!data && (
            <Button variant="outline" colorScheme="red" ml={3} h="28px" onClick={() => selectTabs(tabs)}>
              {t(`${DASHBOARD}.renewNow`)}
            </Button>
          )}
        </HStack>
        {!data && <CloseButton alignSelf="flex-start" position="relative" onClick={onClose} />}
      </AlertDescription>
    </Alert>
  )
}

export const ExpirationAlertMessage: React.FC<{
  insurance?: any
  license?: LicenseDocument[] | undefined
  data?: any
  tabIndex?: number
}> = ({ insurance, license, data, tabIndex }) => {
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true })

  const { expiredInsuranceDate, expiredLicenseDate } = useInsuranceLicenseErrorMessage({ license, insurance })
  const { expiredInsuranceDateProfile, expiredLicenseDateProfile } = useDocumentLicenseMessage({ data })

  return isVisible ? (
    <Box width="70%" mb={data ? '0' : '16px'}>
      {expiredInsuranceDate && expiredLicenseDate ? (
        <CustomAlert title={'licenseInsuranceExpirationMessage'} tabs={1} onClose={onClose} />
      ) : null}

      {expiredInsuranceDate && !expiredLicenseDate ? (
        <CustomAlert title={'insuranceExpirationMessage'} tabs={1} onClose={onClose} />
      ) : null}

      {!expiredInsuranceDate && expiredLicenseDate ? (
        <CustomAlert title={'licenseExpirationMessage'} tabs={2} onClose={onClose} />
      ) : null}

      {expiredInsuranceDateProfile && tabIndex === 1 ? (
        <CustomAlert title={'insuranceExpirationMessage'} tabs={2} onClose={onClose} data={data} />
      ) : null}

      {expiredLicenseDateProfile && tabIndex === 2 ? (
        <CustomAlert title={'licenseExpirationMessage'} data={data} />
      ) : null}
    </Box>
  ) : null
}
