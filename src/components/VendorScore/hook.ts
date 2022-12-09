export const useInsuranceLecenseErrorMessage = ({ insurance, lecense }) => {
  const currentDate = new Date().toISOString()

  const insuranceDate = insurance?.map(value => value.date)
  const lecenseDate = lecense?.licenseDocuments?.map(value => value.licenseExpirationDate)

  const expiredInsuranceDate = insuranceDate?.filter(value => value < currentDate).length
  const expiredLecenseDate = lecenseDate?.filter(value => value < currentDate).length
  return {
    expiredInsuranceDate,
    expiredLecenseDate,
  }
}
