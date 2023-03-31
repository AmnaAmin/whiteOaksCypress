import { useUpdateAlert } from 'api/alerts'
import {
  Divider,
  Box,
  Center,
  Flex,
  MenuItem,
  MenuList,
  Text,
  Heading,
  HStack,
  VStack,
  FormLabel,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
//import { useAuth } from 'utils/auth-context'
import { format } from 'date-fns'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

import { enUS } from 'date-fns/locale'
import { BiWind } from 'react-icons/bi'

export const Notification = props => {
  const { setShowAlertMenu, setNavigating, navigationLoading, setSelectedAlert, alertsLoading, notifications } = props
  const { mutate: updateAlert } = useUpdateAlert({ hideToast: true })

  const showLoadingSlate = navigationLoading || alertsLoading
  useEffect(() => {
    setNavigating(navigationLoading)
  }, [navigationLoading])

  const handleClick = alert => {
    //eslint-disable-next-line
    if (!alert?.webSockectRead) {
      updateAlert({ ...alert, webSockectRead: true })
    }
    setSelectedAlert(alert)
    setShowAlertMenu(false)
  }

  const { t } = useTranslation()

  return (
    <>
      <MenuList
        id="scrollArea"
        boxShadow="1px 1px 10px rgba(0, 0, 0, 0.25)"
        borderRadius="6px"
        maxH="calc(100vh - 100px)"
      >
        <VStack>
          <Box padding="15px" w="100%" borderBottom={'1px solid #2D3748'}>
            <Heading w="100%" color="#2D3748" fontWeight={500} fontSize={16}>
              {t('alertsAndNotifications')}
            </Heading>
          </Box>
          <Box maxH="489px" border="none" overflow="auto" mb={2}>
            {showLoadingSlate ? (
              <>
                <MenuItem width="397px" _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} as="div">
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
                {notifications && notifications?.length > 0 ? (
                  <>
                    {notifications?.map((notification, index) => {
                      return (
                        <MenuItem
                          _hover={{ bg: '#F5F5F5' }}
                          _focus={{ bg: notification?.webSockectRead ? '#FFF' : '#FFF5E4' }}
                          key={notification.id}
                          as="div"
                          mb="2px"
                          width="397px"
                          data-testid={'alert-' + index}
                          backgroundColor={notification?.webSockectRead ? '#FFF' : '#FFF5E4'}
                          onClick={() => {
                            handleClick(notification)
                          }}
                          cursor="pointer"
                        >
                          <HStack width="400px" h="68px">
                            <Center w="68px">
                              <VStack color="gray.500">
                                <Box fontSize={11} fontWeight={400}>
                                  {format(new Date(), 'LLL', { locale: enUS })}
                                </Box>
                                <Box fontSize={13} mt="0px !important" fontWeight={600}>
                                  {new Date(notification?.dateCreated as string).getDate()}
                                </Box>
                              </VStack>
                            </Center>
                            <Divider orientation="vertical" borderWidth={'2px'} borderColor="#F6AD55" h="48px" />
                            <VStack flexDir="column" alignItems={'start'} p="5px" w="100%">
                              <Heading
                                as="h2"
                                data-testid={'alert-' + index + '-title'}
                                fontSize={'12px'}
                                color="blue.600"
                                fontWeight={600}
                              >
                                {notification?.triggeredType + ' - ' + notification?.triggeredId}
                              </Heading>
                              <Text
                                data-testid={'alert-' + index + '-message'}
                                fontSize={'11px'}
                                fontWeight={400}
                                color="gray.600"
                                maxWidth={330}
                                lineHeight="20px"
                              >
                                {notification?.message}
                              </Text>
                            </VStack>
                          </HStack>
                        </MenuItem>
                      )
                    })}
                  </>
                ) : (
                  <Box w="400px">
                    <VStack h="250px" justifyContent={'center'}>
                      <BiWind size={'60px'} color="#718096" />
                      <FormLabel variant={'light-label'} size="md">
                        {t('emptyNotifications')}
                      </FormLabel>
                    </VStack>
                  </Box>
                )}
              </>
            )}
          </Box>
          {notifications && notifications?.length > 0 && (
            <Box w="100%" textAlign={'center'} padding="10px 15px 15px 15px" borderTop={'1px solid #F2F3F4'}>
              <Link
                to="alerts"
                onClick={() => {
                  setShowAlertMenu(false)
                }}
              >
                <Text fontWeight={400} fontSize={14} color="#345EA6">
                  {t('viewAllNotifications')}
                </Text>
              </Link>
            </Box>
          )}
        </VStack>
      </MenuList>
      {/*
      isOpenAlertStatus && (
        <AlertStatusModal isOpen={isOpenAlertStatus} onClose={onCloseAlertStatus} alert={notification} />
      )}
      */}
    </>
  )
}
