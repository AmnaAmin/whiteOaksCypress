import { datePickerFormat } from 'utils/date-time-utils'

export const useInsuranceLicenseErrorMessage = ({ insurance, license }) => {
  const currentDate = datePickerFormat(new Date())

  const expiredInsuranceDate = insurance
    ?.map(value => (datePickerFormat(value?.date) as string) < currentDate!)
    .includes(true)

  const expiredLicenseDate = license
    ?.map(value => (datePickerFormat(value?.licenseExpirationDate) as string) < currentDate!)
    .includes(true)

  return {
    expiredInsuranceDate,
    expiredLicenseDate,
  }
}
