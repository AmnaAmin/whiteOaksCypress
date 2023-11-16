import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Icon,
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
import React, { useEffect, useState } from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useAuth } from 'utils/auth-context'
import { RouterLink } from '../router-link/router-link'
import { useTranslation } from 'react-i18next'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'
import LogoIcon from 'icons/header-logo'
import { BiSearch } from 'react-icons/bi'
import { FaBell } from 'react-icons/fa'
import { alertCountEvent, getAlertCount, resetAlertCount } from 'features/alerts/alerts-service'
import { Notification } from './notifications/notification'
import { useFetchUserAlerts, useHandleNavigation } from 'api/alerts'

// const Notification = React.lazy(() => import("./notification"));

const UserInfo: React.FC<{ show: boolean }> = ({ show }) => {
  const { data } = useAuth()
  const account = data?.user
  const userName = `${account?.firstName} ${account?.lastName}`

  return (
    <HStack>
      <Avatar name={userName} src={account?.imageUrl ?? ''} w="32px" h="32px" />
      <VStack alignItems="start" spacing="0px">
        <Flex alignItems="center">
          <Text fontSize="12px" pr="1" fontWeight={400} fontStyle="normal" color="white" whiteSpace="nowrap">
            {userName}
          </Text>
        </Flex>
        <Text fontSize="12px" fontStyle="normal" fontWeight={400} color="white" whiteSpace="nowrap">
          {account?.authorities?.[0]}
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
  setNavigating?: (val) => void
}

const hoverEffect = {
  _focus: { background: '#F7FAFC' },
}

export const notificationCount = {
  width: '25px',
  height: '25px',
  borderRadius: '100%',
  color: '#fff',
  backgroundColor: '#4299E1',
  display: 'flex',
  justifyContent: 'center',
  bottom: '12px',
  left: '14px',
  alignItems: 'center',
  textAlign: 'center',
  fontWeight: '500',
  position: 'absolute',
  fontSize: '12px',
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu, setNavigating }) => {
  const { logout } = useAuth()
  const [show, setShow] = useState(true)
  const [showAlertMenu, setShowAlertMenu] = useState(false)
  const { t } = useTranslation()
  const [alertCount, setAlertCount] = useState(getAlertCount())
  const [selectedAlert, setSelectedAlert] = useState<any>()
  const { navigationLoading } = useHandleNavigation(selectedAlert)
  const {
    data: notifications,
    refetch: refetchNotifications,
    isLoading: alertsLoading,
  } = useFetchUserAlerts({
    query: 'page=0&size=20&sort=dateCreated,desc',
  })

  const handleAlertIconClick = () => {
    resetAlertCount()
  }

  const handleAlertCountFromFirebase = () => {
    const count = getAlertCount()
    setAlertCount(count)
    if (count > 0) {
      refetchNotifications()
    }
  }

  useEffect(() => {
    handleAlertCountFromFirebase()
    document.addEventListener(alertCountEvent, handleAlertCountFromFirebase, false)
    return () => {
      document.removeEventListener(alertCountEvent, handleAlertCountFromFirebase, false)
    }
  }, [])

  return (
    <Box py="8px" pl={{ base: '1', md: '3' }} bg={mode('#22375B', 'black')} w="100%">
      <HStack justifyContent="space-between">
        <Flex>
          <Button
            leftIcon={<GiHamburgerMenu />}
            variant="unstyled"
            fontSize="18px"
            color="white"
            mr="2"
            onClick={toggleMenu}
            display={{ base: 'inline', lg: 'none' }}
          />
          <Box display={{ base: 'none', sm: 'inline' }}>
            <LogoIcon />
          </Box>
        </Flex>

        <HStack spacing="5" px="1">
          {/* * Language Dropdown Menu */}
          <Box display={{ base: 'none', md: 'block' }}>
            <DropdownLanguage />
          </Box>
          <Box display={{ base: 'block', md: 'none' }}>
            <Icon as={BiSearch} color="white" fontSize="18px" />
          </Box>
          <Box position="relative">
            <Menu
              closeOnSelect={false}
              isOpen={showAlertMenu}
              onClose={() => setShowAlertMenu(false)}
              onOpen={() => setShowAlertMenu(true)}
            >
              <>
                <MenuButton
                  onClick={() => {
                    handleAlertIconClick()
                  }}
                  transition="all 0.2s"
                  _active={{ color: '#4E87F8' }}
                  color="#A0AEC0"
                  _hover={{ color: 'gray.500' }}
                >
                  <FaBell fontSize="16px" />
                  {alertCount > 0 && <Box sx={notificationCount}>{alertCount}</Box>}
                </MenuButton>
                {showAlertMenu && (
                  <Notification
                    setShowAlertMenu={setShowAlertMenu}
                    setNavigating={setNavigating}
                    navigationLoading={navigationLoading}
                    setSelectedAlert={setSelectedAlert}
                    notifications={notifications}
                    alertsLoading={alertsLoading}
                  />
                )}
              </>
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
               data-testid='menu_button'
                bgSize="auto"
                w={{ base: 'auto' }}
                onClick={() => {
                  setShow(!show)
                }}
              >
                <UserInfo show={show} />
              </MenuButton>
              <MenuList
                boxShadow=" 0px 4px 6px 1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
                minWidth="230px"
                position="relative"
                left={12}
                roundedTop={0}
                py={0}
              >
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
