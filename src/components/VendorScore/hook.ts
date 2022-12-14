import { dateFormat } from 'utils/date-time-utils'

export const useInsuranceLicenseErrorMessage = ({ insurance, license }) => {
  const currentDate = dateFormat(new Date().toISOString())

  const expiredInsuranceDate = insurance?.map(value => dateFormat(value?.date) < currentDate).includes(true)

  const expiredLicenseDate = license
    ?.map(value => dateFormat(value?.licenseExpirationDate) < currentDate)
    .includes(true)

  return {
    expiredInsuranceDate,
    expiredLicenseDate,
  }
}
