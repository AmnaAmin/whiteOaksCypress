import { useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Image,
  Button,
  Select,
} from "@chakra-ui/react";

const languageOptions = [
  {
    name: "English",
    code: "en",
    imageUrl:
      "https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg",
  },
  {
    name: "Espanol",
    code: "esp",
    imageUrl:
      "https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg",
  },
];

export const Dropdown = () => {
  const [selectedLanguage, setSelectedLanguage] = useState();

  return (
    <Select placeholder="Select option" variant="unstyled">
      <option value="en">
        {
          <Image
            boxSize="2rem"
            borderRadius="full"
            src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
            alt="Fluffybuns the destroyer"
            mr="12px"
          />
        }
        <span>English</span>
      </option>
      <option value="en">
        <Image
          boxSize="2rem"
          borderRadius="full"
          src="https://cdn.britannica.com/79/4479-050-6EF87027/flag-Stars-and-Stripes-May-1-1795.jpg"
          alt="Fluffybuns the destroyer"
          mr="12px"
        />
        <span>English</span>
      </option>
    </Select>
  );
};

export default Dropdown;
