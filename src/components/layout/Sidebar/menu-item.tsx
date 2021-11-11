import React from 'react';
import { Flex, Box, Text } from '@chakra-ui/react';
import { Link, LinkProps } from '@chakra-ui/layout';
import { transform } from 'lodash';

export const MenuItem: React.FC<LinkProps & { Icon: React.ElementType; title: string }> = props => {
  const { Icon, title, ...rest } = props;

  return (
    <Link
      pl="19px"
      mt="27px"
      fontFamily="Poppins"
      fontStyle="normal"
      fontWeight="500"
      borderLeft="10px solid white"
      _hover={{
        transition: '0.2s ease-in',
        background: 'linear-gradient(89.98deg, rgba(230, 241, 255, 0.61) 54.08%, rgba(230, 241, 255, 0) 94.01%)',
        borderColor: '#4E87F8',
      }}
      w="100%"
      h="28px"
      pb="32px"
      boxSizing="border-box"
      {...rest}
    >
      <Flex alignItems="center" h="33px">
        <Icon />

        <Text pl="10px">{title}</Text>
      </Flex>
    </Link>
  );
};
