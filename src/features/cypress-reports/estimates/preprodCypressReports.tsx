import {Box} from "@chakra-ui/react";

const EstimatesPreprodCypressReports = () => {
    const iframe_src = `https://preprod.woaharvest.com/sorry-cypress/est-output.html`
    return (
        <Box>
            <Box h="calc(100vh - 150px)">
                <iframe
                    title="Estimates: Pre-Prod Cypress Report"
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

export default EstimatesPreprodCypressReports;