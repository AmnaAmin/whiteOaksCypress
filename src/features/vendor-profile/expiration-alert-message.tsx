import { Box, Alert, AlertIcon, AlertDescription, FormLabel } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useDocumentLecenseMessage } from './hook'
import { VENDORPROFILE } from './vendor-profile.i18n'

export const ExpirationAlertMessage: React.FC<{ data: any; tabIndex: number }> = ({ data, tabIndex }) => {
  const { expiredInsuranceDate, expiredLecenseDate } = useDocumentLecenseMessage({ data })
  const { t } = useTranslation()

  return (
    <Box w="70%">
      {expiredInsuranceDate && tabIndex === 1 ? (
        <Alert status="error" rounded={6} h="47px" bg="#FFE4E4">
          <AlertIcon />
          <AlertDescription>
            <FormLabel m={0} color="#E53E3E">
              {t(`${VENDORPROFILE}.insuranceExpirationMessage`)}
            </FormLabel>
          </AlertDescription>
        </Alert>
      ) : null}

      {expiredLecenseDate && tabIndex === 2 ? (
        <Alert status="error" rounded={6} h="47px" bg="#FFE4E4">
          <AlertIcon />
          <AlertDescription>
            <FormLabel m={0} color="#E53E3E">
              {t(`${VENDORPROFILE}.licenseExpirationMessage`)}
            </FormLabel>
          </AlertDescription>
        </Alert>
      ) : null}
    </Box>
  )
}
