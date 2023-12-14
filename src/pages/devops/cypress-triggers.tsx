import { Box, Button, useDisclosure } from '@chakra-ui/react'
import axios from 'axios';
import { IndividualTestModal } from 'features/cypress-triggers/individual-test-modal'
const CypressTiggers = () => {
  
    const token = process.env.REACT_APP_BUILDKITE_TOKEN;
    const branch = "preprod-automation-module2";

    const { isOpen, onOpen, onClose } = useDisclosure()

    const onButtonClick = async (pipelineType: string) => {
        try {
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

          if(response.status === 201){
            alert('Build triggered successfully! Build URL: '+ response.data.build_url)
          }
          
        } catch (error) {
          alert('Trigger failed! Please try again')
          console.error(error);
        }
      };
  
    return (
      <Box>
         <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
        <Button onClick={() => onButtonClick('Scheduled Build.')} isDisabled={true} colorScheme="brand" fontSize="14px" minW={'140px'}>
          Run Parallel Test
        </Button>
        <Button onClick={() => onButtonClick('Sequential Build.')} isDisabled={true} colorScheme="brand" fontSize="14px" minW={'140px'}>
          Run Sequential Test
        </Button>
        <Button onClick={onOpen} isDisabled={true} colorScheme="brand" fontSize="14px" minW={'140px'}>
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
  


