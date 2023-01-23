import { Box, Button, Center, Flex, Link, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BiXCircle } from 'react-icons/bi'
import notificationData from './notificationData.json'

export const Notification = () => {
  const [list, setList] = useState(() => notificationData)

  const handleDelete = id => {
    const newList = list.filter(data => data.id !== id)

    setList(newList)
  }
  const { t } = useTranslation()

  return (
    <>
      <MenuList borderRadius={8} maxH="542px">
        <Box w="519" maxH="489px" border="none" overflow="auto" pb={2}>
          {list.map(data => {
            return (
              <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} key={data.id} as="div">
                <Flex
                  borderRadius={8}
                  width="480px"
                  minH="106px"
                  boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
                >
                  <Center borderLeftRadius={8} bg="#BEE3F8" p="10px" w="68px">
                    <Button variant="link" color="#4299E1" _focus={{ color: 'red.400' }}>
                      <BiXCircle size="35px" onClick={() => handleDelete(data.id)} />
                    </Button>
                  </Center>
                  <Box flexDir="column" pl={5} p={3} lineHeight="24px" _hover={{ bg: 'blue.50' }} w="100%">
                    <Text fontSize={16} color="#4A5568" fontWeight={500}>
                      {data.title}
                    </Text>

                    <Text fontSize={14} fontWeight={400} color="#718096" maxWidth={330} lineHeight="20px">
                      {data.centerText}
                    </Text>

                    <Text fontSize={14} fontWeight={400} color="#A0AEC0" lineHeight="20px">
                      {data.date}
                    </Text>
                  </Box>
                </Flex>
              </MenuItem>
            )
          })}
        </Box>

        <Center
          h="40px"
          w="100%"
          color="#4E87F8"
          textDecor="underline"
          fontWeight={600}
          textAlign="center"
          fontSize={14}
        >
          <Link>{t('viewAllNotification')}</Link>
        </Center>
      </MenuList>
    </>
  )
}
