import { Box, BoxProps } from "@chakra-ui/layout";

export const Card: React.FC<BoxProps> = (props) => {
  return (
    <Box
      bg="white"
      padding="15px"
      boxShadow="1px 1px 12px rgba(0,0,0,0.2)"
      h={props.height || "auto"}
      {...props}
    >
      {props.children}
    </Box>
  );
};
