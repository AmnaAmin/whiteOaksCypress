import { Box, Alert, AlertIcon, AlertDescription, Button } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

export const ExpirationAlertMessage: React.FC<{ insurance: any; lecense: any }> = ({ insurance, lecense }) => {
  const navigate = useNavigate()

  const selectTabs = params => {
    navigate('/vendors', { state: params })
  }

  const currentDate = new Date().toISOString()

  const insuranceDate = insurance?.map(value => value.date)
  const lecenseDate = lecense?.licenseDocuments?.map(value => value.licenseExpirationDate)

  const expiredInsuranceDate = insuranceDate?.filter(value => value < currentDate).length
  const expiredLecenseDate = lecenseDate?.filter(value => value < currentDate).length

  return (
    <Box w="1000px" mb="16px">
      {expiredInsuranceDate && expiredLecenseDate ? (
        <Alert status="error" rounded={6} h="47px">
          <AlertIcon />
          <AlertDescription>
            Your license & insurance has expired, to reactivate please renew your license.
            <Button variant="outline" colorScheme="red" ml={3} h="28px" onClick={() => selectTabs(1)}>
              Renew Now!
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {expiredInsuranceDate && !expiredLecenseDate ? (
        <Alert status="error" rounded={6} h="47px">
          <AlertIcon />
          <AlertDescription>
            Your Insurance has expired, to reactivate please renew your Insurance..
            <Button variant="outline" colorScheme="red" ml={3} h="28px" onClick={() => selectTabs(1)}>
              Renew Now!
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}

      {!expiredInsuranceDate && expiredLecenseDate ? (
        <Alert status="error" rounded={6} h="47px">
          <AlertIcon />
          <AlertDescription>
            Your license has expired, to reactivate please renew your license..
            <Button variant="outline" colorScheme="red" ml={3} h="28px" onClick={() => selectTabs(2)}>
              Renew Now!
            </Button>
          </AlertDescription>
        </Alert>
      ) : null}
    </Box>
  )
}
