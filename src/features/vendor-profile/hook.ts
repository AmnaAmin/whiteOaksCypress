import { Control, useWatch } from 'react-hook-form'
import { DocumentsCardFormValues } from 'types/vendor.types'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { isBefore } from 'date-fns'

export const useDocumentLicenseMessage = ({ data }) => {
  const DocumentDates = [
    data?.w9DocumentDate,
    data?.agreementSignedDate,
    data?.autoInsuranceExpirationDate,
    data?.coiWcExpirationDate,
    data?.coiglExpirationDate,
  ]

  const expiredLicenseDateProfile = data?.licenseDocuments?.map(value =>
    isBefore(new Date(value?.licenseExpirationDate), new Date()),
  )

  const expiredInsuranceDateProfile = DocumentDates.map(value => isBefore(new Date(value), new Date()))

  return {
    expiredLicenseDateProfile,
    expiredInsuranceDateProfile,
  }
}

export const useWatchDocumentFeild = (control: Control<DocumentsCardFormValues>, vendor) => {
  const watchW9DocumentDate = useWatch({ control, name: 'w9DocumentDate' })
  const watchW9DocumentFile = useWatch({ control, name: 'w9Document' })
  const watchAgreementSignedDate = useWatch({ control, name: 'agreementSignedDate' })
  const watchAgreementFile = useWatch({ control, name: 'agreement' })
  const watchAutoInsuranceExpDate = useWatch({ control, name: 'autoInsuranceExpDate' })
  const watchInsuranceFile = useWatch({ control, name: 'insurance' })
  const watchCoiGlExpDate = useWatch({ control, name: 'coiGlExpDate' })
  const watchCoiGlExpFile = useWatch({ control, name: 'coiGlExpFile' })
  const watchCoiWcExpDate = useWatch({ control, name: 'coiWcExpDate' })
  const watchCoiWcExpFile = useWatch({ control, name: 'coiWcExpFile' })

  const isW9DocumentDateChanged = watchW9DocumentDate === dateFormat(vendor?.w9DocumentDate as string)
  const isAgreementSignedDateChanged = watchAgreementSignedDate === dateFormat(vendor?.agreementSignedDate as string)
  const isAutoInsuranceExpDateChanged =
    watchAutoInsuranceExpDate === dateFormat(vendor?.autoInsuranceExpirationDate as string)
  const isCoiGlExpDateChanged = watchCoiGlExpDate === dateFormat(vendor?.coiglExpirationDate as string)
  const isCoiWcExpDateChanged = watchCoiWcExpDate === dateFormat(vendor?.coiWcExpirationDate as string)
  return {
    isW9DocumentDateChanged,
    watchW9DocumentFile,
    isAgreementSignedDateChanged,
    watchAgreementFile,
    isAutoInsuranceExpDateChanged,
    watchInsuranceFile,
    isCoiGlExpDateChanged,
    watchCoiGlExpFile,
    isCoiWcExpDateChanged,
    watchCoiWcExpFile,
  }
}

export const checkIsLicenseChanged = (values: any, licenseDocument) => {
  const watchLicenseType = licenseDocument?.licenseType
  const watchLicenseNumber = licenseDocument?.licenseNumber
  const watchExpiryDate = licenseDocument?.licenseExpirationDate
  const watchExpirationFile = values?.expirationFile

  const isLicenseTypeChanged = watchLicenseType !== values.licenseType
  const isLicenseNumberChanged = watchLicenseNumber !== values?.licenseNumber
  const isExpiryDateChanged = watchExpiryDate !== datePickerFormat(values?.expiryDate)

  return isLicenseTypeChanged || isLicenseNumberChanged || isExpiryDateChanged || watchExpirationFile
}
