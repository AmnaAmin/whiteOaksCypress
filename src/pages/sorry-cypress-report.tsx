import { Box, FormLabel } from '@chakra-ui/react'
import { SIDE_NAV } from 'components/layout/sideNav.i18n'
import { useTranslation } from 'react-i18next'

const SorryCypressReport = () => {
  const iframe_src = `https://sorrycypress-preprod.woaharvest.com/ci-builds`
  const { t } = useTranslation()
  return (
    <Box>
      <FormLabel mb="20px" variant="strong-label" size="lg">
        {t(`${SIDE_NAV}.sorryCypress`)}
      </FormLabel>

      <Box h="calc(100vh - 150px)">
        <iframe title="SorryCypress" id="woiframe" src={iframe_src} width="100%" height="100%" frameBorder="0"></iframe>
      </Box>
    </Box>
  )
}

export default SorryCypressReport
