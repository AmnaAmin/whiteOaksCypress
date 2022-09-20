import { Center } from '@chakra-ui/react'
import { Card } from 'components/card/card'

import RevenuePerformanceGraph from './revenue-performance-graph'

export const PerformanceTab = () => {
  
  return (
    <>
      <Card mt={5} p={0} rounded="13px" flex={1} bg="#FDFDFF">
        <Center mb="5px" mt="25px"> 
        </Center> 
        <RevenuePerformanceGraph />
      </Card>
    </>
  )
}
