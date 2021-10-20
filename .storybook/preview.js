// export const parameters = {
//   actions: { argTypesRegex: "^on[A-Z].*" },
//   controls: {
//     matchers: {
//       color: /(background|color)$/i,
//       date: /Date$/,
//     },
//   },
// }

import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../src/theme";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
};

export const decorators = [
  (Story) => (
    <ChakraProvider theme={theme}>
      <div style={{ margin: "3em" }}>
        <Story />
      </div>
    </ChakraProvider>
  ),
];
