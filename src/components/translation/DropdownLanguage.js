import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaAngleDown } from "react-icons/fa";
import { Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import Flags from "country-flag-icons/react/3x2";
import { useSaveLanguage, useAccountDetails } from "utils/vendor-details";

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
        {account?.langKey === "en" ? (
          <div
            style={{
              width: "30px",
              height: "20px",
              paddingRight: "5px",
              display: "inline",
            }}
          >
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
          </div>
        ) : (
          <div
            style={{
              width: "30px",
              height: "20px",
              paddingRight: "5px",
              display: "inline",
            }}
          >
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
          </div>
        )}
      </MenuButton>

      <FaAngleDown fontSize="0.9rem" style={{ display: "inline" }} />
      <MenuList>
        <MenuItem value="en" onClick={handleLangChange}>
          <Flags.US
            title="United Kingdom"
            className="..."
            style={{ width: "30px", height: "20px", paddingRight: "5px" }}
          />
          English
        </MenuItem>
        <MenuItem value="es" onClick={handleLangChange}>
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
