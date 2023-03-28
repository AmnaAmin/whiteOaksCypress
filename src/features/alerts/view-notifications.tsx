import { useFetchUserAlertsInfinite, useHandleNavigation, useUpdateAlert } from 'api/alerts'
import { Divider, Box, Center, Flex, Text, Heading, HStack, VStack, FormLabel, Spinner } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
//import { useAuth } from 'utils/auth-context'
import { format } from 'date-fns'
import { BlankSlate } from 'components/skeletons/skeleton-unit'

import { enUS } from 'date-fns/locale'
import { BiWind } from 'react-icons/bi'
import { useCallback, useEffect, useRef, useState } from 'react'

export const Notifications = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useFetchUserAlertsInfinite({})
  const notifications = data?.pages?.flat()
  const [selectedAlert, setSelectedAlert] = useState<any>()
  const { navigationLoading } = useHandleNavigation(selectedAlert)
  const { mutate: updateAlert } = useUpdateAlert({ hideToast: true })
  const showLoadingSlate = navigationLoading
  const observerElem = useRef(null)

  const handleObserver = useCallback(
    entries => {
      const [target] = entries
      if (target.isIntersecting && hasNextPage) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage],
  )

  useEffect(() => {
    const element = observerElem.current
    if (element) {
      const option = { threshold: 0, root: document.querySelector('#scrollArea') }
      const divHeight = (element as any)?.clientHeight
      option.threshold = 1 / divHeight
      const observer = new IntersectionObserver(handleObserver, option)
      observer.observe(element as any)
      return () => observer.unobserve(element as any)
    }
  }, [handleObserver, fetchNextPage, hasNextPage])

  useEffect(() => {
    let fetching = false
    const handleScroll = async e => {
      const { scrollHeight, scrollTop, clientHeight } = e.target.scrollingElement
      if (!fetching && scrollHeight - scrollTop <= clientHeight * 1.2) {
        fetching = true
        if (hasNextPage) await fetchNextPage()
        fetching = false
      }
    }
    document.addEventListener('scroll', handleScroll)
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage])

  const handleClick = alert => {
    //eslint-disable-next-line
    if (!alert?.webSockectRead) {
      updateAlert(
        { ...alert, webSockectRead: true },
        {
          onSuccess: () => {
            //refetchNotifications()
          },
        },
      )
    }
    setSelectedAlert(alert)
  }
  /* const handeResolve = id => {
    resolveAlerts([id], {
      onSuccess: () => {
        refetchNotifications()
      },
    })
  } */

  const { t } = useTranslation()

  return (
    <>
      <Box w="100%">
        <VStack>
          <Box w="100%" maxH="calc(100vh - 200px)" border="none" overflow="auto" pl="10px" pr="10px">
            {showLoadingSlate ? (
              <>
                <Box width="100%" _hover={{ bg: 'none' }} _focus={{ bg: 'none' }} as="div">
                  <Flex
                    borderRadius={8}
                    width="100%"
                    minH="106px"
                    boxShadow="0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)"
                  >
                    <Box flexDir="column" pl={5} p={3} _hover={{ bg: 'blue.50' }} w="100%">
                      <BlankSlate size={'sm'} />
                    </Box>
                  </Flex>
                </Box>
              </>
            ) : (
              <>
                {notifications && notifications?.length > 0 ? (
                  <>
                    {notifications?.map((notification, index) => {
                      return (
                        <Box
                          _hover={{ bg: '#F5F5F5' }}
                          _focus={{ bg: 'none' }}
                          key={notification.id}
                          as="div"
                          mb="2px"
                          width="100%"
                          data-testid={'alert-' + index}
                          backgroundColor={notification?.webSockectRead ? '#FFF' : '#FFF5E4'}
                          onClick={() => {
                            handleClick(notification)
                          }}
                          border={'1px solid #E2E2E2'}
                          borderRadius={'10px'}
                          cursor="pointer"
                        >
                          <HStack width="100%" h="80px">
                            <Center w="68px">
                              <VStack color="gray.500">
                                <Box fontSize={14} fontWeight={400}>
                                  {format(new Date(), 'LLL', { locale: enUS })}
                                </Box>
                                <Box fontSize={16} mt="0px !important" fontWeight={600}>
                                  {new Date(notification?.dateCreated as string).getDate()}
                                </Box>
                              </VStack>
                            </Center>
                            <Divider orientation="vertical" borderWidth={'2px'} borderColor="#F6AD55" h="48px" />
                            <VStack flexDir="column" alignItems={'start'} p="5px" w="100%">
                              <Heading
                                as="h2"
                                data-testid={'alert-' + index + '-title'}
                                fontSize={'14px'}
                                color="blue.600"
                                fontWeight={600}
                              >
                                {notification?.triggeredType + ' - ' + notification?.triggeredId}
                              </Heading>
                              <Text
                                data-testid={'alert-' + index + '-message'}
                                fontSize={'12px'}
                                fontWeight={400}
                                color="gray.600"
                                maxWidth={330}
                                lineHeight="20px"
                              >
                                {notification?.message}
                              </Text>
                            </VStack>
                          </HStack>
                        </Box>
                      )
                    })}
                    <Box className="loader" ref={observerElem}>
                      {isFetchingNextPage && hasNextPage ? (
                        <Center height={50}>
                          <Spinner size="lg" />
                        </Center>
                      ) : (
                        <>{'All Caught Up'}</>
                      )}
                    </Box>
                  </>
                ) : (
                  <Box w="100%">
                    <VStack h="400px" justifyContent={'center'}>
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
        </VStack>
      </Box>
      {/*
      isOpenAlertStatus && (
        <AlertStatusModal isOpen={isOpenAlertStatus} onClose={onCloseAlertStatus} alert={notification} />
      )}
      */}
    </>
  )
}
