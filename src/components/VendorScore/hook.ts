import { isBefore } from 'date-fns'

export const useInsuranceLicenseErrorMessage = ({ insurance, license }) => {
  const expiredInsuranceDate = insurance?.map(value => isBefore(new Date(value?.date), new Date()))
  const expiredLicenseDate = license?.map(value => isBefore(new Date(value?.licenseExpirationDate), new Date()))

  return {
    expiredInsuranceDate,
    expiredLicenseDate,
  }
}
