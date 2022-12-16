import React from 'react'
import { Box, Button, Container, Flex, Stack, Text, useColorModeValue as mode } from '@chakra-ui/react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { SidebarLink } from './sidebar-link'
import { useMobileMenuState } from 'utils/hooks/useMobileMenuState'
import { AiOutlineVerticalLeft, AiOutlineVerticalRight } from 'react-icons/ai'
import { useRoleBasedMenu } from './constants'
import { IdleTimeOutModal } from './idle-time-out'
import { useTranslation } from 'react-i18next'
import { SIDE_NAV } from './sideNav.i18n'
import { BiChevronDown } from 'react-icons/bi'

export const Layout: React.FC = props => {
  const { isOpen, toggle } = useMobileMenuState()
  const menu = useRoleBasedMenu()
  const { t } = useTranslation()

  return (
    <Box width="100%">
      <Box position="fixed" top="0" left="0" right="0" zIndex="sticky">
        <Header toggleMenu={toggle} />
      </Box>

      <Container maxW="full" pt="65px" position="relative" sx={{ '--sidebar-width': '12.6rem' }}>
        <IdleTimeOutModal />
        <Flex
          position="fixed"
          top="66px"
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
                  {menu?.map(item => (
                    <>
                      {item.title === `${SIDE_NAV}.userMgmt` && (
                        <Flex
                          alignItems="center"
                          h="43px"
                          w="201px"
                          style={{
                            borderTop: '1px solid #EDF2F7',
                            borderBottom: '1px solid #EDF2F7',
                            paddingLeft: '8px',
                            marginBottom: '21px',
                            marginTop: '28px',
                          }}
                        >
                          <BiChevronDown color="#718096" style={{ width: '24px', height: '24px' }} />
                          <Text
                            color="gray.500"
                            as="span"
                            style={{ fontWeight: 600, fontSize: '14px', lineHeight: '28px' }}
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
            bg="gray.50"
            color="gray.400"
            _hover={{
              bg: 'gray.200',
              color: 'gray.600',
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
          p="1rem"
          w="(calc(100% - var(--sidebar-width)"
        >
          {props.children}
        </Box>
      </Container>
    </Box>
  )
}
