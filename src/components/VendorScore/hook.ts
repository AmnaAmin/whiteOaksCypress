export const useInsuranceLicenseErrorMessage = ({ insurance, license }) => {
  const currentDate = new Date().toISOString()

  const insuranceDate = insurance?.map(value => value.date)
  const licenseDate = license?.map(value => value.licenseExpirationDate)

  const expiredInsuranceDate = insuranceDate?.filter(value => value < currentDate).length
  const expiredLicenseDate = licenseDate?.filter(value => value < currentDate).length
  return {
    expiredInsuranceDate,
    expiredLicenseDate,
  }
}
