import { Box, Button } from '@chakra-ui/react'


const AutomationDashboard = () => {
  const onButtonClick = () => {
    // Replace 'yourURL' with the actual URL you want to navigate to
    const urlToNavigate = 'https://cloudwatch.amazonaws.com/dashboard.html?dashboard=constructionDashboard&context=eyJSIjoidXMtZWFzdC0xIiwiRCI6ImN3LWRiLTU4MzU4NTg2ODgxNyIsIlUiOiJ1cy1lYXN0LTFfRWlKeDBiTWdWIiwiQyI6IjRiZ29ndTNpaTR2cDh1bDIwMG5ka2ZzMDEwIiwiSSI6InVzLWVhc3QtMTpjZThiZjAxMi0yYWUzLTQ2NjUtYWFkZC01YTE1ZDg2NjgyYTMiLCJPIjoiYXJuOmF3czppYW06OjU4MzU4NTg2ODgxNzpyb2xlL3NlcnZpY2Utcm9sZS9DV0RCU2hhcmluZy1SZWFkT25seUFjY2Vzcy0yS0JGREJDVyIsIk0iOiJVc3JQd1NpbmdsZSJ9';

    // Open a new tab with the specified URL
    window.open(urlToNavigate, '_blank');
  };

  return (
    <Box>

      <Button onClick={onButtonClick} colorScheme="brand" fontSize="14px" minW={'140px'}>
      CloudWatch Dashboard
    </Button>
    
    </Box>
  )

  
}

export default AutomationDashboard