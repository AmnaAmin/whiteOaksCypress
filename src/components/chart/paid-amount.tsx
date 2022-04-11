import React from 'react';
import { Box, Text, Stack } from '@chakra-ui/react';

export const PaidAmount: React.FC<{ data: string }> = props => {
  const { data } = props;
  return (
    <Box w="153px" h="75px" bg="#FFFFFF" rounded="8px" boxShadow="0px 3px 5px 3px rgb(112 144 176 / 12%)">
      <Stack marginInlineStart="1rem" spacing={0} pt="10px">
        <Text fontWeight={500} fontSize="12px" color="#A3AED0" lineHeight="20px">
          Paid
        </Text>
        <Text fontSize="24px" fontWeight={700} lineHeight="32px">
          {props.data}
        </Text>
      </Stack>
    </Box>
  );
};
