import { Box, Center, Flex, Link, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { BiXCircle } from 'react-icons/bi'

type NotificationValueType = {
  textTop: string
  textSecond: string
  textThird: string
}

const NotificationStructure = (props: NotificationValueType) => {
  return (
    <Flex
      borderRadius={8}
      width="480px"
      minH="106px"
      boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
    >
      <Center borderLeftRadius={8} bg="#BEE3F8" color="white" p="10px" w="68px">
        <BiXCircle size="35px" color="#4299E1" />
      </Center>
      <Box flexDir="column" pl={5} p={3} lineHeight="24px" _hover={{ bg: 'gray.100' }} w="100%">
        <Text fontSize={16} color="#4A5568" fontWeight={500}>
          {props.textTop}
        </Text>

        <Text fontSize={14} fontWeight={400} color="#718096" maxWidth={330} lineHeight="20px">
          {props.textSecond}
        </Text>

        <Text fontSize={14} fontWeight={400} color="#A0AEC0" lineHeight="20px">
          {props.textThird}
        </Text>
      </Box>
    </Flex>
  )
}

export const Notification = () => {
  return (
    <>
      <MenuList borderRadius={8}>
        <Box w="519" maxH="489px" border="none" overflow="auto">
          <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }}>
            <NotificationStructure
              textTop={'729 Rocky grove GLN'}
              textSecond={'Project Management changed from tracyhowe to devtek fpm'}
              textThird={'3 days ago'}
            />
          </MenuItem>

          <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }}>
            <NotificationStructure
              textTop={'729 Rocky grove GLN'}
              textSecond={'Project Management changed from tracyhowe to devtek fpm'}
              textThird={'3 days ago'}
            />
          </MenuItem>

          <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }}>
            <NotificationStructure
              textTop={'729 Rocky grove GLN'}
              textSecond={'Project Management changed from tracyhowe to devtek fpm'}
              textThird={'3 days ago'}
            />
          </MenuItem>

          <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }}>
            <NotificationStructure
              textTop={'729 Rocky grove GLN'}
              textSecond={'Project Management changed from tracyhowe to devtek fpm'}
              textThird={'3 days ago'}
            />
          </MenuItem>

          <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }}>
            <NotificationStructure
              textTop={'729 Rocky grove GLN'}
              textSecond={'Project Management changed from tracyhowe to devtek fpm'}
              textThird={'3 days ago'}
            />
          </MenuItem>

          <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }}>
            <NotificationStructure
              textTop={'729 Rocky grove GLN'}
              textSecond={'Project Management changed from tracyhowe to devtek fpm'}
              textThird={'3 days ago'}
            />
          </MenuItem>

          <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }}>
            <NotificationStructure
              textTop={'729 Rocky grove GLN'}
              textSecond={'Project Management changed from tracyhowe to devtek fpm'}
              textThird={'3 days ago'}
            />
          </MenuItem>

          <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }}>
            <NotificationStructure
              textTop={'729 Rocky grove GLN'}
              textSecond={'Project Management changed from tracyhowe to devtek fpm'}
              textThird={'3 days ago'}
            />
          </MenuItem>
        </Box>

        <Center p="8px">
          <Box w="100%" color="#4E87F8" textDecor="underline" fontWeight={600} textAlign="center" fontSize={14}>
            <Link>View All Notification</Link>
          </Box>
        </Center>
      </MenuList>
    </>
  )
}
