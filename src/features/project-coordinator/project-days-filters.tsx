import { Button, Divider, Flex, Stack } from '@chakra-ui/react'

export const ProjectDayFilters = () => {
  return (
    <>
      <Stack direction="row" justify="left" marginTop={1} marginLeft={15}>
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          All
        </Button>
        <Divider orientation="vertical" height="35px" border="1px solid #A0AEC0 !important" />
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          Mon
          <Flex
            w="22px"
            h="22px !important"
            margin={1}
            rounded="50"
            bg="#E2E8F0"
            color="black"
            _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
            fontSize="12px"
            paddingTop={1}
            paddingLeft={2}
          >
            2
          </Flex>
        </Button>
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          Tue
          <Flex
            w="22px"
            h="22px !important"
            margin={1}
            rounded="50"
            bg="#E2E8F0"
            color="black"
            _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
            fontSize="12px"
            paddingTop={1}
            paddingLeft={2}
          >
            3
          </Flex>
        </Button>
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          Wed
          <Flex
            w="22px"
            h="22px !important"
            margin={1}
            rounded="50"
            bg="#E2E8F0"
            color="black"
            _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
            fontSize="12px"
            paddingTop={1}
            paddingLeft={2}
          >
            2
          </Flex>
        </Button>
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          Thu
          <Flex
            w="22px"
            h="22px !important"
            margin={1}
            rounded="50"
            bg="#E2E8F0"
            color="black"
            _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
            fontSize="12px"
            paddingTop={1}
            paddingLeft={2}
          >
            3
          </Flex>
        </Button>
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          Fri
          <Flex
            w="22px"
            h="22px !important"
            margin={1}
            rounded="50"
            bg="#E2E8F0"
            color="black"
            _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
            fontSize="12px"
            paddingTop={1}
            paddingLeft={2}
          >
            2
          </Flex>
        </Button>
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          Sat
          <Flex
            w="22px"
            h="22px !important"
            margin={1}
            rounded="50"
            bg="#E2E8F0"
            color="black"
            _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
            fontSize="12px"
            paddingTop={1}
            paddingLeft={2}
          >
            3
          </Flex>
        </Button>
        <Button
          bg="none"
          border="none"
          rounded="20"
          _hover={{ bg: '#4E87F8', color: 'white', rounded: '20', border: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
          alignContent="right"
          color="black"
        >
          Sun
          <Flex
            w="22px"
            h="22px !important"
            margin={1}
            rounded="50"
            bg="#E2E8F0"
            color="black"
            _hover={{ bg: 'white', color: '#4E87F8', rounded: '50', border: 'none' }}
            fontSize="12px"
            paddingTop={1}
            paddingLeft={2}
          >
            2
          </Flex>
        </Button>
        <Divider orientation="vertical" height="35px" border="1px solid #A0AEC0 !important" marginLeft={5} />
        <Button
          bg="none"
          color="#4E87F8"
          _hover={{ bg: 'none' }}
          _focus={{ border: 'none' }}
          fontSize="12px"
          fontStyle="normal"
          fontWeight={500}
        >
          Clear Filter
        </Button>
      </Stack>
    </>
  )
}
