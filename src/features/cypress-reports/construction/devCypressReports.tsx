import {Box} from "@chakra-ui/react";

const ConstructionDevCypressReports = () => {
    const iframe_src = `https://preprod.woaharvest.com/sorry-cypress/dev-output.html`
    return (
      <Box>
        <Box h="calc(100vh - 150px)">
          <iframe
            title="Construction: Dev. Cypress Report"
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

  export default ConstructionDevCypressReports;