import { Box, Alert, AlertIcon, AlertDescription } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'

export const ExpirationAlertMessage: React.FC<{ data: any; tabIndex: number }> = ({ data, tabIndex }) => {
  const currentDate = new Date()

  const Document = [
    {
      date: data?.w9DocumentDate,
    },
    {
      date: data?.agreementSignedDate,
    },
    {
      date: data?.autoInsuranceExpirationDate,
    },
    {
      date: data?.coiWcExpirationDate,
    },
    {
      date: data?.coiglExpirationDate,
    },
  ]

  const DocumentDates = Document?.map(value => value.date)
  const lecenseDate = data?.licenseDocuments?.map(value => value.licenseExpirationDate)

  const expiredLecenseDate = lecenseDate?.filter(value => dateFormat(value) < dateFormat(currentDate)).length
  const expiredInsuranceDate = DocumentDates?.filter(value => dateFormat(value) < dateFormat(currentDate)).length

  return (
    <Box>
      {expiredInsuranceDate && tabIndex === 1 ? (
        <Alert status="error" rounded={6} h="47px">
          <AlertIcon />
          <AlertDescription>Your Insurance has expired, to reactivate please renew your Insurance.</AlertDescription>
        </Alert>
      ) : null}

      {expiredLecenseDate && tabIndex === 2 ? (
        <Alert status="error" rounded={6} h="47px">
          <AlertIcon />
          <AlertDescription>Your license has expired, to reactivate please renew your license.</AlertDescription>
        </Alert>
      ) : null}
    </Box>
  )
}
