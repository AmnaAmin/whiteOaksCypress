export const dateFormatter = d => {
  const date = new Date(String(d))
  const formattedDate = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  })
  return formattedDate
}
