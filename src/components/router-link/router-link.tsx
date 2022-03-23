import React from 'react'
import { Text } from '@chakra-ui/react'
import { LinkProps, Link } from 'react-router-dom'

const textStyle = {
  color: '#4A5568',
  fontSize: '14px',
  fontWeight: 500,
  lineHeight: '20px',
  fontStyle: 'normal',
}
export const RouterLink: React.FC<LinkProps> = ({ to, children }) => {
  return (
    <Link to={to} style={{ display: 'block', width: '100%' }}>
      <Text sx={textStyle}>{children}</Text>
    </Link>
  )
}
