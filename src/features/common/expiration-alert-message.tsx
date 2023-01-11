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
    <Box
      width={{
        sm: '100%',
        md: '70%',
        lg: '70%',
      }}
      marginTop={{ base: '4px', sm: '30px', md: 0, xl: 0, lg: 0 }}
    >
      <Alert
        status="error"
        rounded={6}
        bg="#FFE4E4"
        pr={1}
        mb={3}
        h={{ sm: 'auto', md: '47px', xl: '47px', lg: '47px' }}
      >
        <AlertIcon />
        <AlertDescription display="flex" justifyContent="space-between" w="100%">
          <HStack>
            <FormLabel
              variant="strong-label"
              m={0}
              color="#F56565"
              fontSize={{ base: '12px', sm: '14px', lg: '16px' }}
              lineHeight="20px"
            >
              {t(`${DASHBOARD ? DASHBOARD : VENDORPROFILE}.${title}`)}
            </FormLabel>
            {!data && (
              <Button variant="outline" colorScheme="red" ml={3} h="28px" onClick={() => selectTabs(tabs)}>
                {t(`${DASHBOARD}.renewNow`)}
              </Button>
            )}
          </HStack>
          {!data && <CloseButton onClick={onClose} m={3} />}
        </AlertDescription>
      </Alert>
    </Box>
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
    <Box>
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
