import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useColorModeValue as mode,
  VStack,
} from '@chakra-ui/react'
import DropdownLanguage from 'translation/DropdownLanguage'
import React, { useState } from 'react'
import { FaBell } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useAuth } from 'utils/auth-context'
import LogoIcon from 'icons/header-logo'
import { RouterLink } from '../router-link/router-link'
import { Notification } from './notification'
import { useTranslation } from 'react-i18next'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'

// const Notification = React.lazy(() => import("./notification"));

const UserInfo: React.FC<{ show: boolean }> = ({ show }) => {
  const { data } = useAuth()
  const account = data?.user
  const userName = `${account?.firstName} ${account?.lastName}`

  return (
    <HStack>
      <Avatar name={userName} src={account?.imageUrl ?? ''} w="32px" h="32px" />
      <VStack alignItems="start" spacing="0px" visibility={{ base: 'hidden', md: 'visible' }}>
        <Flex alignItems="center">
          <Text fontSize="12px" pr="1" fontWeight={400} fontStyle="normal" color="white">
            {userName}
          </Text>
        </Flex>
        <Text fontSize="12px" fontStyle="normal" fontWeight={400} color="white">
          {account?.userTypeLabel}
        </Text>
      </VStack>
      <Box position="relative" bottom=" 8.5px" px="4px" color="white" fontSize="20px">
        {show ? <HiChevronDown /> : <HiChevronUp />}
      </Box>
    </HStack>
  )
}

type HeaderProps = {
  toggleMenu?: () => void
}

const hoverEffect = {
  _focus: { background: '#F7FAFC' },
}
export const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const { logout } = useAuth()
  const [show, setShow] = useState(true)
  // const [showNotification, setShowNotification] = useState(false)
  const { t } = useTranslation()

  return (
    <Box py="8px" px={{ base: '1', md: '3' }} bg={mode('#22375B', 'black')} w="100%">
      <HStack justifyContent="space-between">
        <Flex>
          <Button
            leftIcon={<GiHamburgerMenu />}
            variant="unstyled"
            size="md"
            mr="2"
            onClick={toggleMenu}
            display={{ base: 'inline', lg: 'none' }}
          />
          <LogoIcon />
        </Flex>

        <HStack spacing="5" px="1">
          {/* * Language Dropdown Menu */}
          <Box display={{ base: 'none', md: 'block' }}>
            <DropdownLanguage />
          </Box>
          <Box position="relative">
            <Menu
              closeOnSelect={false}
              // isOpen={showNotification}
              // onClose={() => setShowNotification(false)}
              // onOpen={() => setShowNotification(true)}
            >
              <MenuButton
                transition="all 0.2s"
                _active={{ color: '#4E87F8' }}
                color="#A0AEC0"
                _hover={{ color: 'gray.500' }}
              >
                <FaBell fontSize="16px" />
              </MenuButton>
              <Notification />

              {/* {showNotification && (
                <Suspense fallback={() => <AiOutlineLoading3Quarters className="fa-spin" fontSize="1.5rem" />}>
                  <Notification />
                </Suspense>
              )} */}
            </Menu>
          </Box>

          {/** User Dropdown Menu */}
          <HStack spacing={4} _hover={{ bg: '#14213D' }} pl="1">
            <Menu placement="bottom">
              <MenuButton
                bgSize="auto"
                w={{ base: '50px', md: 'auto' }}
                onClick={() => {
                  setShow(!show)
                }}
              >
                <UserInfo show={show} />
              </MenuButton>
              <MenuList minWidth="230px" position="relative" left={12} roundedTop={0} pb={0}>
                <MenuItem sx={hoverEffect} h="48px" borderBottom="1px solid #E2E8F0">
                  <RouterLink to="/settings">{t('settings')}</RouterLink>
                </MenuItem>
                <MenuItem sx={hoverEffect} h="48px" borderBottom="1px solid #E2E8F0">
                  <RouterLink to="/password">{t('password')}</RouterLink>
                </MenuItem>
                <MenuItem
                  sx={hoverEffect}
                  as={Link}
                  color="gray.600"
                  fontWeight={400}
                  fontSize="14px"
                  target="_blank"
                  href="https://docs.woaharvest.com/"
                  _hover={{ textDecorationLine: 'none' }}
                  h="48px"
                  borderBottom="1px solid #E2E8F0"
                >
                  {t('help')}
                </MenuItem>
                <MenuItem sx={hoverEffect} h="48px" borderBottom="1px solid #E2E8F0">
                  <RouterLink to="/support">{t('support')}</RouterLink>
                </MenuItem>
                <MenuItem sx={hoverEffect} h="48px">
                  <Box
                    onClick={logout}
                    fontSize="14px"
                    fontWeight={400}
                    fontStyle="normal"
                    lineHeight="20px"
                    color="#4A5568"
                    width="100%"
                  >
                    {t('signOut')}
                  </Box>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  )
}
