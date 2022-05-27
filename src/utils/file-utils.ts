export const downloadFile = url => {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.download = url.split('/').pop()
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
