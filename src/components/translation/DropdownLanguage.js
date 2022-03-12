import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleDown } from "react-icons/fa";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Box,
  HStack,
  Stack,
} from "@chakra-ui/react";
import Flags from "country-flag-icons/react/3x2";
import { useSaveLanguage, useAccountDetails } from "utils/vendor-details";

const languageStyle = {
  paddingRight: "5px",
  fontWeight: 500,
  fontSize: "14px",
  color: "#4A5568",
};

const DropdownLanguage = () => {
  const { i18n } = useTranslation();
  const { data: account, refetch } = useAccountDetails();
  const { mutate: saveLanguage } = useSaveLanguage();
  // const [language, setLanguage] = useState(account?.langKey);

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (account) {
      const lastSelected = account?.langKey;
      // setLanguage(lastSelected);
      i18n.changeLanguage(lastSelected);
    }
  }, [account, i18n]);

  const handleLangChange = (evt) => {
    const lang = evt.target.value;
    // setLanguage(lang);
    i18n.changeLanguage(lang);
    const languagePayload = {
      firstName: account.firstName,
      lastName: account.lastName,
      login: account.email,
      langKey: lang,
    };
    saveLanguage(languagePayload);
    setTimeout(() => {
      refetch();
    }, 500);
  };

  return (
    <Menu placement="bottom">
      <MenuButton
        onChange={handleLangChange}
        variant="text"
        colorScheme="blue"
        bgSize="auto"
        w={{ base: "50px", md: "auto" }}
      >
        <Stack direction="row" alignItems="center" spacing={-1}>
          {account?.langKey === "en" ? (
            <Box sx={languageStyle} display="inline-flex">
              <Flags.US
                title="United States of America"
                className="..."
                style={{
                  width: "30px",
                  height: "20px",
                  paddingRight: "5px",
                  display: "inline",
                }}
              />
              English
            </Box>
          ) : (
            <Box sx={languageStyle} display="inline-flex">
              <Flags.ES
                title="Espanol"
                className="..."
                style={{
                  width: "30px",
                  height: "20px",
                  paddingRight: "5px",
                  display: "inline",
                }}
              />
              Espanol
            </Box>
          )}
          <FaAngleDown
            fontSize="0.9rem"
            display="inline-flex"
            color="#4A5568"
          />
        </Stack>
      </MenuButton>

      <MenuList>
        <MenuItem value="en" onClick={handleLangChange} sx={languageStyle}>
          <Flags.US
            title="United Kingdom"
            className="..."
            style={{ width: "30px", height: "20px", paddingRight: "5px" }}
          />
          English
        </MenuItem>
        <MenuItem value="es" onClick={handleLangChange} sx={languageStyle}>
          <Flags.ES
            title="Español"
            className="..."
            style={{ width: "30px", height: "20px", paddingRight: "5px" }}
          />
          Español
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default DropdownLanguage;
