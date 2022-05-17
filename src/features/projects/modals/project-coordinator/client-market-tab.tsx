import * as React from 'react'
import { useState } from 'react'
import { Box, Checkbox, Flex, Center, Text, Button } from '@chakra-ui/react'
const cuntryName = [
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

const CheckStructer = props => {
  const [check, setCheck] = useState(false)
  //   console.log('check', props.name, check)
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
        fontWeight={600}
      >
        <Text color="gray.500">{props.name}</Text>
      </Center>
    </Box>
  )
}

export const CheckBoxes = props => {
  return (
    <Box h="517px">
      <Flex flexWrap="wrap">
        {cuntryName.map(name => {
          return <CheckStructer name={name.name} />
        })}
      </Flex>
      <Flex mt={355} h="80px" alignItems="center" justifyContent="end" borderTop="1px solid #CBD5E0 ">
        <Button colorScheme="brand" variant="outline" mr={3} onClick={props.onClose}>
          Close
        </Button>
        <Button colorScheme="brand">Next</Button>
      </Flex>
    </Box>
  )
}
