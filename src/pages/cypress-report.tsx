import { Box, FormLabel } from '@chakra-ui/react'
import { SIDE_NAV } from 'components/layout/sideNav.i18n'
import { useTranslation } from 'react-i18next'

const CypressReport = () => {
  const iframe_src = `https://preprod.woaharvest.com/cypress/buildResults/output.html`
  const { t } = useTranslation()
  return (
    <Box>
      <FormLabel mb="20px" variant="strong-label" size="lg">
        {t(`${SIDE_NAV}.cypressReport`)}
      </FormLabel>

      <Box h="calc(100vh - 150px)">
        <iframe
          title="Cypress Report"
          id="woiframe"
          src={iframe_src}
          width="100%"
          height="100%"
          frameBorder="0"
        ></iframe>
      </Box>
    </Box>
  )
}

export default CypressReport
