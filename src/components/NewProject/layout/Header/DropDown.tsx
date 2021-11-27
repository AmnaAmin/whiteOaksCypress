import { AspectRatio, Box } from "@chakra-ui/layout";
import { Select } from "@chakra-ui/select";
const HeaderDropdown = () => {
  return (
    <Select name="countries-lenguageis" border="none">
      <option value="FR">English</option>
      <option value="pak">Urdu</option>
    </Select>
  );
};
export default HeaderDropdown;
