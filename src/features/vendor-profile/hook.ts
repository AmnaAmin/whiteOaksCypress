import { Control, useWatch } from 'react-hook-form'
import { DocumentsCardFormValues } from 'types/vendor.types'
import { datePickerFormat } from 'utils/date-time-utils'

export const useDocumentLicenseMessage = ({ data }) => {
  const DocumentDates = [
    // data?.w9DocumentDate,
    // data?.agreementSignedDate,
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
    hasExpiredDocumentOrLicense: expiredInsuranceDateProfile || expiredLicenseDateProfile,
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
    watchW9DocumentDate !== datePickerFormat(vendor?.w9DocumentDate as string) && (watchW9DocumentDate ?? false)

  const isAgreementSignedDateChanged =
    watchAgreementSignedDate !== datePickerFormat(vendor?.agreementSignedDate as string) &&
    (watchAgreementSignedDate ?? false)

  const isAutoInsuranceExpDateChanged =
    watchAutoInsuranceExpDate !== datePickerFormat(vendor?.autoInsuranceExpirationDate as string) &&
    (watchAutoInsuranceExpDate ?? false)

  const isCoiGlExpDateChanged =
    watchCoiGlExpDate !== datePickerFormat(vendor?.coiglExpirationDate as string) && (watchCoiGlExpDate ?? false)

  const isCoiWcExpDateChanged =
    watchCoiWcExpDate !== datePickerFormat(vendor?.coiWcExpirationDate as string) && (watchCoiWcExpDate ?? false)

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
    watchW9DocumentDate,
    isAgreementSignedDateChanged,
    watchAgreementFile,
    watchAgreementSignedDate,
    isAutoInsuranceExpDateChanged,
    watchInsuranceFile,
    watchAutoInsuranceExpDate,
    isCoiGlExpDateChanged,
    watchCoiGlExpFile,
    watchCoiGlExpDate,
    isCoiWcExpDateChanged,
    watchCoiWcExpFile,
    watchCoiWcExpDate,
    isAllFiledWatch,
  }
}

export const checkIsLicenseChanged = (values: any, licenseDocument) => {
  const watchLicenseType = licenseDocument?.licenseType
  const watchLicenseNumber = licenseDocument?.licenseNumber
  //const watchExpiryDate = licenseDocument?.licenseExpirationDate
  const watchExpirationFile = licenseDocument?.s3Url && values?.expirationFile

  //const watchExpiryDateNot = watchExpiryDate !== undefined

  const isLicenseTypeChanged = watchLicenseType !== values.licenseType
  const isLicenseNumberChanged = watchLicenseNumber !== values?.licenseNumber 

  /*

  the 
  date comparison is creating bugs it needs to be fixed
  const isExpiryDateChanged = watchExpiryDate !== datePickerFormat(values?.expiryDate) && watchExpiryDateNot
  

  return isLicenseTypeChanged || isLicenseNumberChanged || isExpiryDateChanged || !!watchExpirationFile*/

  return isLicenseTypeChanged || isLicenseNumberChanged || !!watchExpirationFile
}
