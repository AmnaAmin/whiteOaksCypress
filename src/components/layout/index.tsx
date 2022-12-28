import React from 'react'
import { Box, Button, Container, Flex, FormLabel, Stack, Text, useColorModeValue as mode } from '@chakra-ui/react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { SidebarLink } from './sidebar-link'
import { useMobileMenuState } from 'utils/hooks/useMobileMenuState'
import { AiOutlineVerticalLeft, AiOutlineVerticalRight } from 'react-icons/ai'
import { useRoleBasedMenu } from './constants'
import { IdleTimeOutModal } from './idle-time-out'
import { useTranslation } from 'react-i18next'
import { SIDE_NAV } from './sideNav.i18n'

export const Layout: React.FC = props => {
  const { isOpen, toggle } = useMobileMenuState()
  const menu = useRoleBasedMenu()
  const { t } = useTranslation()

  return (
    <Box width="100%">
      <Box position="fixed" top="0" left="0" right="0" zIndex="sticky" style={{ color: '#A1A6B1' }}>
        <Header toggleMenu={toggle} />
      </Box>

      <Container maxW="full" pt="50px" position="relative" sx={{ '--sidebar-width': '12.6rem' }}>
        <IdleTimeOutModal />
        <Flex
          position="fixed"
          top="51px"
          bottom="0"
          left={isOpen ? '0' : 'calc((var(--sidebar-width)+100) * -1)'}
          transition="left 0.5s ease-in-out"
          zIndex="dropdown"
        >
          <Box
            as="nav"
            display="block"
            flex="1"
            width="var(--sidebar-width)"
            py="5"
            bg={mode('#14213D', '#14213D')}
            boxShadow={isOpen ? 'xl' : '0'}
          >
            <Box fontSize="sm" lineHeight="short">
              <Sidebar>
                <Stack align="start" spacing={'2px'}>
                  <FormLabel ml={6} color="#A1A6B1" size="sm" letterSpacing="1px">
                    {t(`${SIDE_NAV}.menu`)}
                  </FormLabel>
                  {menu?.map(item => (
                    <>
                      {item.title === `${SIDE_NAV}.userMgmt` && (
                        <Flex
                          alignItems="center"
                          h="43px"
                          w="201px"
                          style={{
                            borderTop: '1px solid rgb(237, 242, 247, 0.25)',
                            borderBottom: '1px solid rgb(237, 242, 247, 0.25)',
                            paddingLeft: '26px',
                            marginBottom: '21px',
                            marginTop: '28px',
                          }}
                        >
                          <Text
                            as="span"
                            style={{
                              fontWeight: 6500,
                              fontSize: '13px',
                              lineHeight: '28px',
                              color: '#A1A6B1',
                              letterSpacing: '1px',
                            }}
                          >
                            {t(`${SIDE_NAV}.administration`)}
                          </Text>
                        </Flex>
                      )}
                      <Box w="201px" key={item.pathTo}>
                        <SidebarLink
                          pathTo={item.pathTo}
                          title={t(item.title)}
                          icon={<item.Icon color={item.color} />}
                        />
                      </Box>
                    </>
                  ))}
                </Stack>
              </Sidebar>
            </Box>
          </Box>

          <Button
            display={{ base: 'none', lg: 'unset' }}
            _focus={{ outline: 'none' }}
            leftIcon={isOpen ? <AiOutlineVerticalRight /> : <AiOutlineVerticalLeft />}
            variant="solid"
            size="xs"
            onClick={toggle}
            fontSize="16px"
            bg="#14213D"
            color="gray.400"
            _hover={{
              bg: '#22375B',
              color: 'white',
            }}
            maxW="0"
            minW="20px"
            h="21px"
            p="0.5"
            rounded={0}
            mt="14px"
          />
        </Flex>

        <Box
          // @ts-ignore
          marginStart={{
            base: '0',
            lg: 'var(--sidebar-width)' && isOpen ? 'var(--sidebar-width)' : null,
          }}
          transition={isOpen ? '0.5s' : '1s'}
          height="calc(100vh - 65px)"
          py="1rem"
          pl="8px"
          w="(calc(100% - var(--sidebar-width)"
        >
          {props.children}
        </Box>
      </Container>
    </Box>
  )
}
