import { Box, Button, useDisclosure } from '@chakra-ui/react'
import axios from 'axios';
import { IndividualTestModal } from 'features/cypress-triggers/individual-test-modal'
const CypressTiggers = () => {
  
    const token = "bkua_381e83ae5ef0f1f90623f199aa89a1c79d902a3f";
    const branch = "preprod-automation-module2";
    // const org_slug = "DevTek";
    // const pipeline_slug = "next-gen-whiteoaks-ui";

    const { isOpen, onOpen, onClose } = useDisclosure()

    const onButtonClick = async (pipelineType: string) => {
        try {
          // Use axios to trigger the Buildkite REST API with the appropriate parameters
          const response = await axios.post(
            `https://api.buildkite.com/v2/organizations/DevTek/pipelines/next-gen-whiteoaks-ui/builds`,
            {
              "commit": "HEAD",
              "branch": branch,
              "message": pipelineType,
              "env": {
                "ENV": "preprod-Automation"
              }
            },
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": 'Bearer '+token, 
              },
            }
          );
          // Handle the response as needed
          console.log('Build triggered successfully:', response.data);
        } catch (error) {
          // Handle errors
          console.error(error);
        }
      };
  
    return (
      <Box>
         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button onClick={() => onButtonClick('Scheduled Build.')} colorScheme="brand" fontSize="14px" minW={'140px'}>
          Run Parallel Test
        </Button>
        <Button onClick={() => onButtonClick('Sequential Build.')} colorScheme="brand" fontSize="14px" minW={'140px'}>
          Run Sequential Test
        </Button>
        <Button onClick={onOpen} colorScheme="brand" fontSize="14px" minW={'140px'}>
          Run Individual Test
        </Button>
      </div>
        <Box h="calc(100vh - 150px)">
        </Box>
        <IndividualTestModal onClose={onClose} isOpen={isOpen} />
      </Box>
        
             
          
    )
  }
  
  export default CypressTiggers
  


