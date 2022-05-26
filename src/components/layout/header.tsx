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
import DropdownLanguage from 'components/translation/DropdownLanguage'
// import { IRootState } from "app/shared/reducers";
import React, { useMemo, useState } from 'react'
// import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { FaAngleDown, FaAngleUp, FaBell } from 'react-icons/fa'
import { GiHamburgerMenu } from 'react-icons/gi'
import { useAuth } from 'utils/auth-context'
import LogoIcon from 'icons/header-logo'
import { RouterLink } from '../router-link/router-link'
import { Notification } from './notification'
import { useTranslation } from 'react-i18next'

// const Notification = React.lazy(() => import("./notification"));

const UserInfo: React.FC = () => {
  const { data } = useAuth()
  const account = data?.user
  const userName = `${account?.firstName} ${account?.lastName}`
  const isAdmin = useMemo(() => {
    return account?.authorities.find(authority => authority === 'ROLE_ADMIN')
  }, [account?.authorities])

  return (
    <HStack>
      <Avatar
        name={userName}
        src={account?.imageUrl ?? ''}
        w={{ base: '30px', md: '42px' }}
        h={{ base: '30px', md: '42px' }}
      />
      <VStack alignItems="start" spacing="0.3" visibility={{ base: 'hidden', md: 'visible' }}>
        <Flex alignItems="center">
          <Text fontSize="16px" pr="1" fontWeight={500} fontStyle="normal" color="gray.600">
            {userName}
          </Text>
        </Flex>
        <Text fontSize="14px" fontStyle="normal" fontWeight={400} color="gray.600">
          {isAdmin ? 'Admin' : 'User'}
        </Text>
      </VStack>
    </HStack>
  )
}

type HeaderProps = {
  toggleMenu?: () => void
}

export const Header: React.FC<HeaderProps> = ({ toggleMenu }) => {
  const { logout } = useAuth()
  const [show, setShow] = useState(true)
  // const [showNotification, setShowNotification] = useState(false)
  const { t } = useTranslation()

  return (
    <Box py="3" px={{ base: '1', md: '5' }} bg={mode('white', 'black')} w="100%">
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
                <FaBell fontSize="1.7rem" />
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
          <HStack spacing={4} _hover={{ bg: 'gray.100', rounded: '6px' }} pl="1">
            <Menu placement="bottom">
              <MenuButton
                bgSize="auto"
                w={{ base: '50px', md: 'auto' }}
                onClick={() => {
                  setShow(!show)
                }}
              >
                <UserInfo />
              </MenuButton>
              <MenuList minWidth="279px">
                <MenuItem>
                  <RouterLink to="/settings">{t('settings')}</RouterLink>
                </MenuItem>
                <MenuItem>
                  <RouterLink to="/password">{t('password')}</RouterLink>
                </MenuItem>
                <MenuItem>
                  <Link
                    color="gray.600"
                    fontWeight={400}
                    fontSize="14px"
                    target="_blank"
                    href="https://13.212.88.107/"
                    title="help"
                    _hover={{ textDecorationLine: 'none' }}
                  >
                    {t('help')}
                  </Link>
                </MenuItem>
                <MenuItem>
                  <RouterLink to="/support">{t('support')}</RouterLink>
                </MenuItem>
                <MenuItem>
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
              <Box position="relative" bottom=" 8.5px" right=" 16px" color="#4A5568">
                {show ? <FaAngleDown color="#4A5568" /> : <FaAngleUp color="#4A5568" />}
              </Box>
            </Menu>
          </HStack>
        </HStack>
      </HStack>
    </Box>
  )
}
