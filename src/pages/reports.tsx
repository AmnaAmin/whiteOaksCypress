import { Box, Flex, Text, Button } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const Reports = () => {
  const { t } = useTranslation()
  const iframe_src = process.env.REACT_APP_SUPERSET_URL + '/superset/dashboard/11/?standalone=2'
  let navigate = useNavigate()
  return (
    <Box>
      <Flex
        px={0}
        alignItems="center"
        bg="gray.50"
        h="52px"
        borderBottom="1px solid #E2E8F0"
        borderTopRadius={6}
        fontSize="18px"
        fontWeight={500}
        color="gray.600"
      >
        <Text flex={1}>
          <Button colorScheme="brand" fontSize="14px" onClick={() => navigate(-1)}>
            {t('rptBackBtnLabel')}
          </Button>
        </Text>
      </Flex>
      <Box alignItems="left">
        <iframe title="WOA Reports" id="woiframe" src={iframe_src} width="100%" height="680px" frameBorder="0"></iframe>
      </Box>
    </Box>
  )
}

export default Reports
