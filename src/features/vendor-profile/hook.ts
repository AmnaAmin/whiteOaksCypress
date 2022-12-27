import { Control, useWatch } from 'react-hook-form'
import { DocumentsCardFormValues } from 'types/vendor.types'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'

export const useDocumentLicenseMessage = ({ data }) => {
  const DocumentDates = [
    // data?.w9DocumentDate,
    data?.agreementSignedDate,
    data?.autoInsuranceExpirationDate,
    data?.coiWcExpirationDate,
    data?.coiglExpirationDate,
  ]

  const currentDate = datePickerFormat(new Date())

  const expiredLicenseDateProfile = data?.licenseDocuments
    ?.map(value => (datePickerFormat(value?.licenseExpirationDate) as string) < currentDate!)
    .includes(true)

  const expiredInsuranceDateProfile = DocumentDates.map(
    value => (datePickerFormat(value) as string) < currentDate!,
  ).includes(true)

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

  const isW9DocumentDateChanged =
    watchW9DocumentDate !== dateFormat(vendor?.w9DocumentDate as string) && (watchW9DocumentDate ?? false)

  const isAgreementSignedDateChanged =
    watchAgreementSignedDate !== dateFormat(vendor?.agreementSignedDate as string) &&
    (watchAgreementSignedDate ?? false)

  const isAutoInsuranceExpDateChanged =
    watchAutoInsuranceExpDate !== dateFormat(vendor?.autoInsuranceExpirationDate as string) &&
    (watchAutoInsuranceExpDate ?? false)

  const isCoiGlExpDateChanged =
    watchCoiGlExpDate !== dateFormat(vendor?.coiglExpirationDate as string) && (watchCoiGlExpDate ?? false)

  const isCoiWcExpDateChanged =
    watchCoiWcExpDate !== dateFormat(vendor?.coiWcExpirationDate as string) && (watchCoiWcExpDate ?? false)

  const isAllFiledWatch =
    isW9DocumentDateChanged ||
    watchW9DocumentFile ||
    isAgreementSignedDateChanged ||
    watchAgreementFile ||
    isAutoInsuranceExpDateChanged ||
    watchInsuranceFile ||
    isCoiGlExpDateChanged ||
    watchCoiGlExpFile ||
    isCoiWcExpDateChanged ||
    watchCoiWcExpFile

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
    isAllFiledWatch,
  }
}

export const checkIsLicenseChanged = (values: any, licenseDocument) => {
  const watchLicenseType = licenseDocument?.licenseType
  const watchLicenseNumber = licenseDocument?.licenseNumber
  const watchExpiryDate = licenseDocument?.licenseExpirationDate
  const watchExpirationFile = values?.expirationFile

  const watchLicenseTypeNot = watchLicenseType !== undefined
  const watchLicenseNumberNot = watchLicenseNumber !== undefined
  const watchExpiryDateNot = watchExpiryDate !== undefined

  const isLicenseTypeChanged = watchLicenseType !== values.licenseType && watchLicenseTypeNot
  const isLicenseNumberChanged = watchLicenseNumber !== values?.licenseNumber && watchLicenseNumberNot
  const isExpiryDateChanged = watchExpiryDate !== datePickerFormat(values?.expiryDate) && watchExpiryDateNot

  return isLicenseTypeChanged || isLicenseNumberChanged || isExpiryDateChanged || !!watchExpirationFile
}
