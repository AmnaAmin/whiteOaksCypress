import { Box } from '@chakra-ui/react'


const SonarQubeDashboard = () => {
  const iframe_src = `https://sonarqube-preprod.woaharvest.com/`
  return (
    <Box>
      <Box h="calc(100vh - 150px)">
        <iframe title="SonarQubeDashboard" id="woiframe" src={iframe_src} width="100%" height="100%" frameBorder="0"></iframe>
      </Box>
    </Box>
  )
}

export default SonarQubeDashboard


