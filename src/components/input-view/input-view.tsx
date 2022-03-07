import React from 'react';
import { Box, Divider, Heading, HStack, Stack } from '@chakra-ui/react';

interface InputViewProps {
  label: string;
  Icon?: JSX.Element;
  InputElem?: JSX.Element;
  showDivider?: boolean;
  controlStyle?: any;
}

const InputView = ({ label, Icon, InputElem, showDivider = true, controlStyle = {} }: InputViewProps) => {
  return (
    <Box {...controlStyle}>
      <HStack align="flex-start" spacing={5}>
        {Icon && (
          <Box fontSize="1.8rem" color="#718096">
            {Icon}
          </Box>
        )}
        <Stack>
          <Heading as="h5" color={'gray.700'} fontSize={'16px'}>
            {label}
          </Heading>
          {InputElem}
        </Stack>
      </HStack>
      {showDivider && <Divider orientation="horizontal" pt={5} mb={5} />}
    </Box>
  );
};

export default InputView;
