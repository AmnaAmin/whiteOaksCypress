import React from 'react'
import { Box, Button, Container, Flex, Stack, useColorModeValue as mode, VStack } from '@chakra-ui/react'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { SidebarLink } from './sidebar-link'
import { FaAlignCenter, FaHome, FaUser } from 'react-icons/fa'
import { useMobileMenuState } from 'utils/hooks/useMobileMenuState'
import { AiOutlineVerticalLeft, AiOutlineVerticalRight } from 'react-icons/ai'

export const Layout: React.FC = props => {
  const { isOpen, toggle } = useMobileMenuState()

  return (
    <VStack width="100%">
      <Box position="fixed" top="0" left="0" right="0" zIndex="sticky">
        <Header toggleMenu={toggle} />
      </Box>

      <Container maxW="full" pt="65px" position="relative" sx={{ '--sidebar-width': '12.6rem' }}>
        <Flex
          position="fixed"
          top="55px"
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
            bg={mode('white', 'black')}
            boxShadow={isOpen ? 'xl' : '0'}
          >
            <Box fontSize="sm" lineHeight="short">
              <Sidebar>
                <Stack align="start" spacing={3}>
                  <Box w="201px">
                    <SidebarLink pathTo="/vendorDashboard" title="Dashboard" icon={<FaHome />} />
                  </Box>
                  <Box w="201px">
                    <SidebarLink pathTo="/projects" title="Projects" icon={<FaAlignCenter />} />
                  </Box>
                  <Box w="201px">
                    <SidebarLink pathTo="/vendors" title="Profile" icon={<FaUser />} />
                  </Box>
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
            bg="#F3F8FF"
            color="#A0AEC0"
            w="20px"
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
    </VStack>
  )
}
