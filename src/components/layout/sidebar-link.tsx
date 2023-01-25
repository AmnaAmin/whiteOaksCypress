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
  const isEstimateDetails = pathname.includes('/estimate-details')
  const isLinkSelected =
    pathname === pathTo ||
    pathTo === 'Dashboard' ||
    (pathTo === '/projects' && isProjectDetails) ||
    (pathTo === '/estimates' && isEstimateDetails)
  return { isLinkSelected }
}

export const SidebarLink: React.FC<SidebarLinkProps> = props => {
  const { pathTo, title, icon = <ArrowRight />, ...rest } = props
  const { isLinkSelected } = useCheckPathSelected(pathTo)
  const selectedLinkStyle = useMemo(() => {
    return {
      color: '#FFFFFF',
      borderColor: '#68D391',
    }
  }, [])
  const linkState = isLinkSelected
    ? {
        ...selectedLinkStyle,
        borderRightColor: '#68D391',
        // bgGradient: 'linear-gradient(89.98deg, rgba(230, 241, 255, 0.61) 87.64%, rgba(230, 241, 255, 0) 98.4%)',
        bg: '#22375B',
        boxShadow: '0px 2px 4px -3px gray !important',
        fontWeight: 500,
      }
    : {}

  return (
    <Box
      as={Link}
      to={pathTo}
      color="gray.400"
      fontSize="12px"
      display="block"
      pl="5"
      py="2"
      mx="5px"
      borderRight="6px solid transparent"
      cursor="pointer"
      _hover={{
        // bgGradient: 'linear-gradient(90deg, #EBF8FF 78.66%, rgba(235, 248, 255, 0) 98.79%)',
        bg: '#22375B',
        borderColor: '#68D391',
      }}
      className="group"
      fontWeight={400}
      {...linkState}
      {...rest}
      rounded={6}
    >
      <HStack spacing="16px">
        <Box _groupHover={{ opacity: 1 }} fontSize="20px">
          {icon}
        </Box>
        <Text fontSize="14px" lineHeight="28px" fontStyle="normal" isTruncated title={title}>
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
