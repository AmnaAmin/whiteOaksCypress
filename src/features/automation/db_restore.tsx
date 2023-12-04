import React, { useState} from 'react';
import { Box, Button } from '@chakra-ui/react'
import { triggerDBWorkflow, getDbRestoreStatus } from 'api/github_api';



const DBRestoreWorkflow: React.FC = () => {

  const [buildStatus, setBuildStatus] = useState<string | null>(null);

  const handleButtonClick = async () => {
    const status = await triggerDBWorkflow();
    setBuildStatus(status);
  };

  const getStatus = async () => {
    const status = await getDbRestoreStatus();
    alert(status);
  };

  return (
    <div>
      <Box>

      <Button onClick={handleButtonClick} colorScheme="brand" fontSize="14px" minW={'140px'}>
      Run Restore Preprod DB Workflow
    </Button>

      <h2><b>Build Status</b></h2>
      <div>{buildStatus || 'No build status available'}</div>
      </Box>

    <Box>
      <Button onClick={getStatus} colorScheme="brand" fontSize="14px" minW={'140px'}>
      Check Status
    </Button>
    </Box>
    </div>
  );
};


export default DBRestoreWorkflow;
      