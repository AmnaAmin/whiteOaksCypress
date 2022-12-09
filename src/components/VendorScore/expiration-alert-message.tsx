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
import { DASHBOARD } from 'features/vendor/dashboard/dashboard.i18n'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useInsuranceLecenseErrorMessage } from './hook'

const CustomAlert: React.FC<{ title: string; tabs: number; onClose: () => void }> = ({ title, tabs, onClose }) => {
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
            {t(`${DASHBOARD}.${title}`)}
          </FormLabel>

          <Button variant="outline" colorScheme="red" ml={3} h="28px" onClick={() => selectTabs(tabs)}>
            {t(`${DASHBOARD}.renewNow`)}
          </Button>
        </HStack>
        <CloseButton alignSelf="flex-start" position="relative" onClick={onClose} />
      </AlertDescription>
    </Alert>
  )
}

export const ExpirationAlertMessage: React.FC<{ insurance: any; lecense: any }> = ({ insurance, lecense }) => {
  const { isOpen: isVisible, onClose } = useDisclosure({ defaultIsOpen: true })

  const { expiredInsuranceDate, expiredLecenseDate } = useInsuranceLecenseErrorMessage({ lecense, insurance })

  return isVisible ? (
    <Box width="70%" mb="16px">
      {expiredInsuranceDate && expiredLecenseDate ? (
        <CustomAlert title={'licenseInsuranceExpirationMessage'} tabs={1} onClose={onClose} />
      ) : null}

      {expiredInsuranceDate && !expiredLecenseDate ? (
        <CustomAlert title={'insuranceExpirationMessage'} tabs={1} onClose={onClose} />
      ) : null}

      {!expiredInsuranceDate && expiredLecenseDate ? (
        <CustomAlert title={'licenseExpirationMessage'} tabs={2} onClose={onClose} />
      ) : null}
    </Box>
  ) : null
}
