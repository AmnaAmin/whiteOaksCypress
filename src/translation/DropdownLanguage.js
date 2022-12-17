import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Menu, MenuButton, MenuItem, MenuList, Stack, Center } from '@chakra-ui/react'
import Flags from 'country-flag-icons/react/3x2'
import { useSaveLanguage, useAccountDetails } from 'api/vendor-details'
import { HiChevronDown } from 'react-icons/hi'

const languageStyle = {
  paddingRight: '5px',
  fontWeight: 400,
  fontSize: '12px',
  color: '#4A5568',
  _focus: { background: 'blue.50' },
}

const selectedLanguageStyle = {
  paddingRight: '5px',
  fontWeight: 400,
  fontSize: '12px',
  color: 'white',
  _focus: { background: 'blue.50' },
}

const DropdownLanguage = () => {
  const { i18n } = useTranslation()
  const { data: account, refetch } = useAccountDetails()
  const { mutate: saveLanguage } = useSaveLanguage()

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (account) {
      const lastSelected = account?.langKey
      i18n.changeLanguage(lastSelected)
    }
  }, [account, i18n])

  const handleLangChange = evt => {
    const lang = evt.target.value
    i18n.changeLanguage(lang)
    const languagePayload = {
      firstName: account.firstName,
      lastName: account.lastName,
      login: account.email,
      langKey: lang,
    }
    saveLanguage(languagePayload)
    setTimeout(() => {
      refetch()
    }, 500)
  }

  return (
    <Menu placement="bottom" color="white">
      <MenuButton
        p="1"
        _hover={{ bg: '#14213D', rounded: '6px' }}
        onChange={handleLangChange}
        variant="text"
        bgSize="auto"
        w={{ base: '50px', md: 'auto' }}
      >
        <Stack direction="row" alignItems="center" spacing={-1}>
          {!account?.langKey || account?.langKey === 'en' ? (
            <Center sx={selectedLanguageStyle}>
              <Flags.US
                title="United States of America"
                className="..."
                style={{
                  width: '30px',
                  height: '20px',
                  paddingRight: '5px',
                  display: 'inline',
                }}
              />
              English
            </Center>
          ) : (
            <Center sx={selectedLanguageStyle}>
              <Flags.ES
                title="Espanol"
                className="..."
                style={{
                  width: '30px',
                  height: '20px',
                  paddingRight: '5px',
                  display: 'inline',
                }}
              />
              Espanol
            </Center>
          )}
          <HiChevronDown display="inline-flex" color="white" fontSize="20px" />
        </Stack>
      </MenuButton>

      <MenuList>
        <MenuItem value="en" onClick={handleLangChange} sx={languageStyle}>
          <Flags.US
            title="United Kingdom"
            className="..."
            style={{ width: '30px', height: '20px', paddingRight: '5px' }}
          />
          English
        </MenuItem>
        <MenuItem value="es" onClick={handleLangChange} sx={languageStyle}>
          <Flags.ES title="Español" className="..." style={{ width: '30px', height: '20px', paddingRight: '5px' }} />
          Español
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default DropdownLanguage
