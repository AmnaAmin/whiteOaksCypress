import { Box} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

const CypressReport = () => {
  const iframe_src = `https://woa-preprod-documents.s3.us-east-2.amazonaws.com/sorry-cypress/output.html`
  return (
    <Box>
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
