import React, { useMemo } from 'react'
import { Box, BoxProps, createIcon, HStack, Text } from '@chakra-ui/react'
import {} from '@chakra-ui/theme-tools'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

interface SidebarLinkProps extends BoxProps {
  icon?: React.ReactElement
  title: string
  pathTo: string
}

const useCheckPathSelected = (pathTo: string) => {
  const { pathname } = useLocation()
  const isProjectDetails = pathname.includes('/project-details')
  const isLinkSelected = pathname === pathTo || pathTo === 'Dashboard' || (pathTo === '/projects' && isProjectDetails)
  return { isLinkSelected }
}

export const SidebarLink: React.FC<SidebarLinkProps> = props => {
  const { pathTo, title, icon = <ArrowRight />, ...rest } = props
  const { isLinkSelected } = useCheckPathSelected(pathTo)
  const selectedLinkStyle = useMemo(() => {
    return {
      color: '#4E87F8',
    }
  }, [])
  const linkState = isLinkSelected
    ? {
        ...selectedLinkStyle,
        borderLeftColor: '#4E87F8',
        bgGradient: 'linear-gradient(89.98deg, rgba(230, 241, 255, 0.61) 54.08%, rgba(230, 241, 255, 0) 94.01%)',
      }
    : {}

  return (
    <Box
      as={Link}
      to={pathTo}
      marginEnd="2"
      color="gray.600"
      fontSize="sm"
      display="block"
      px="2"
      py="2"
      borderLeft="4px solid transparent"
      cursor="pointer"
      className="group"
      fontWeight="medium"
      {...linkState}
      {...rest}
    >
      <HStack>
        <Box _groupHover={{ opacity: 1 }} fontSize="16px">
          {icon}
        </Box>
        <Text fontSize="18px" fontWeight={500} lineHeight="28px" fontStyle="normal" pt="2px">
          {title}
        </Text>
      </HStack>
    </Box>
  )
}

const ArrowRight = createIcon({
  viewBox: '0 0 16 16',
  path: (
    <path
      d="M3.38974 12.6633L9.42974 12.6633C9.86308 12.6633 10.2697 12.4567 10.5164 12.1033L13.1497 8.39C13.3164 8.15667 13.3164 7.85 13.1497 7.61667L10.5097 3.89667C10.2697 3.54334 9.86308 3.33667 9.42974 3.33667L3.38974 3.33667C2.84974 3.33667 2.53641 3.95667 2.84974 4.39667L5.42974 8.00334L2.84974 11.61C2.53641 12.05 2.84974 12.6633 3.38974 12.6633V12.6633Z"
      fill="currentcolor"
    />
  ),
})
