import { Box, Button, Center, Flex, MenuItem, MenuList, Text, useDisclosure } from '@chakra-ui/react'
import { useFetchUserAlerts, useResolveAlerts, useUpdateAlert } from 'api/alerts'
import { useTranslation } from 'react-i18next'

import { BiXCircle } from 'react-icons/bi'
import { useAuth } from 'utils/auth-context'
import { formatDistanceToNow } from 'date-fns'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { Link } from 'react-router-dom'
import { AlertStatusModal } from 'features/estimate-details/alerts/alert-status'
import { useState } from 'react'

export const Notification = props => {
  const { data } = useAuth()
  const { setShowAlertMenu } = props
  const account = data?.user
  const { notifiations, isLoading } = useFetchUserAlerts(null, account?.login)
  const { mutate: resolveAlerts, isLoading: isResolving } = useResolveAlerts({ hideToast: true })
  const { mutate: updateAlert } = useUpdateAlert({ hideToast: true })
  const [notification, setNotification] = useState()
  const showLoadingSlate = isLoading || isResolving
  const { isOpen: isOpenAlertStatus, onClose: onCloseAlertStatus, onOpen: OnOpenAlertStatus } = useDisclosure()
  const handeResolve = id => {
    resolveAlerts([id])
  }

  const handleClick = alert => {
    setNotification(alert)
    if (!alert?.webSockectRead) {
      updateAlert({ ...alert, webSockectRead: true })
    }
    OnOpenAlertStatus()
    setShowAlertMenu(false)
  }
  const { t } = useTranslation()

  return (
    <>
      <MenuList borderRadius={8} maxH="542px">
        <Box maxH="489px" border="none" overflow="auto" pb={2}>
          {showLoadingSlate ? (
            <>
              <MenuItem _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} as="div">
                <Flex
                  borderRadius={8}
                  width="480px"
                  minH="106px"
                  boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
                >
                  <Box flexDir="column" pl={5} p={3} _hover={{ bg: 'blue.50' }} w="100%">
                    <BlankSlate size={'sm'} />
                  </Box>
                </Flex>
              </MenuItem>
            </>
          ) : (
            <>
              {notifiations.map(notification => {
                return (
                  <MenuItem
                    _hover={{ bg: 'none' }}
                    _focus={{ bg: 'none' }}
                    key={notification.id}
                    as="div"
                    opacity={notification?.webSockectRead ? 0.6 : 1}
                  >
                    <Flex
                      borderRadius={8}
                      width="480px"
                      minH="106px"
                      boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
                    >
                      <Center borderLeftRadius={8} bg="#BEE3F8" p="10px" w="68px">
                        <Button variant="link" color="#4299E1" _focus={{ color: 'red.400' }}>
                          <BiXCircle size="35px" onClick={() => handeResolve(notification.id)} />
                        </Button>
                      </Center>
                      <Box
                        onClick={() => {
                          handleClick(notification)
                        }}
                        cursor="pointer"
                        flexDir="column"
                        pl={5}
                        p={3}
                        lineHeight="24px"
                        _hover={{ bg: 'blue.50' }}
                        w="100%"
                      >
                        <Text fontSize={16} color="#4A5568" fontWeight={500}>
                          {notification?.title}
                        </Text>

                        <Text fontSize={14} fontWeight={400} color="#718096" maxWidth={330} lineHeight="20px">
                          {notification?.message}
                        </Text>

                        <Text fontSize={14} fontWeight={400} color="#A0AEC0" lineHeight="20px">
                          {formatDistanceToNow(new Date(notification?.dateCreated as string)) + ' ago'}
                        </Text>
                      </Box>
                    </Flex>
                  </MenuItem>
                )
              })}
            </>
          )}
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
          <Link to="alerts">{t('viewAllNotifications')}</Link>
        </Center>
      </MenuList>
      {isOpenAlertStatus && (
        <AlertStatusModal isOpen={isOpenAlertStatus} onClose={onCloseAlertStatus} alert={notification} />
      )}
    </>
  )
}
