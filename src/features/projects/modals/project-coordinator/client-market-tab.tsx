import { useState } from 'react'
import { Box, Checkbox, Flex, Center, Text, Button } from '@chakra-ui/react'
const countryName = [
  {
    id: 1,
    name: 'Atlanta',
  },
  {
    id: 2,
    name: 'Baltimore',
  },
  {
    id: 3,
    name: 'Birmingham',
  },
  {
    id: 4,
    name: 'Brooklyn',
  },
  {
    id: 5,
    name: 'Charlotte',
  },
  {
    id: 6,
    name: 'Chicago',
  },
  {
    id: 7,
    name: 'Dallas',
  },
  {
    id: 8,
    name: 'DS',
  },
  {
    id: 9,
    name: 'Iran',
  },
  {
    id: 10,
    name: 'Denver',
  },
  {
    id: 11,
    name: 'Fayetteville',
  },
  {
    id: 12,
    name: 'Greenville',
  },
  {
    id: 13,
    name: 'Houston',
  },
  {
    id: 14,
    name: 'Jacksonville',
  },
  {
    id: 15,
    name: 'Las vegas',
  },
  {
    id: 16,
    name: 'Long island',
  },
  {
    id: 17,
    name: 'Manhattan',
  },
  {
    id: 18,
    name: 'Miami- Ft Lauderdale',
  },
]

const Market = props => {
  const [check, setCheck] = useState(false)
  return (
    <Box>
      <Checkbox isChecked={check} bg="red" hidden />
      <Center
        cursor="pointer"
        onClick={() => {
          setCheck(!check)
        }}
        p="3px"
        px="8px"
        m={2}
        bg={check ? 'green.200' : 'gray.200'}
        rounded={6}
        fontSize="14px"
      >
        <Text color="gray.500">{props.name}</Text>
      </Center>
    </Box>
  )
}

export const Markets = props => {
  return (
    <Box h="517px">
      <Flex flexWrap="wrap">
        {countryName.map(name => {
          return <Market name={name.name} />
        })}
      </Flex>
      <Flex mt={355} h="80px" alignItems="center" justifyContent="end" borderTop="1px solid #CBD5E0 ">
        <Button colorScheme="brand">Cancel</Button>
      </Flex>
    </Box>
  )
}
