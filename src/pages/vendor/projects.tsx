import { Box, Heading, VStack, Text, useMediaQuery } from '@chakra-ui/react'
import { useEffect } from 'react'
import { ProjectFilters } from 'features/vendor/projects/project-fliters'
import { ProjectsTable } from 'features/vendor/projects/projects-table'
import { useLocation } from 'react-router-dom'
import { useStickyState } from 'utils/hooks'
import { Card } from 'components/card/card'
import { boxShadow } from 'theme/common-style'
import { useTranslation } from 'react-i18next' 

const Projects = () => {
  const [selectedCard, setSelectedCard] = useStickyState(null, 'project.selectedCard');

  const [ t ] = useTranslation();

  const [isLessThanOrEq320] = useMediaQuery( "(max-width: 320px)" );

  const { state } = useLocation()
  useEffect(() => {
    if (state) {
      setSelectedCard(`${state}`)
    }
  }, [state])

  if ( isLessThanOrEq320 ) {
    return (
      <Box mt="50%">
        <Heading as='h3' size='sm'>
          Sorry !
        </Heading>
        <Text fontSize='sm'>
          {t('Your resolution is reached at a limit, please switch to a better resolution or change your device orientation from vertical to horizontal')}.
        </Text>
      </Box>
    );
  }

  return (
    <>
      <VStack spacing="14px" w="100%" mt={{ base: "20px", xl: 0, lg: 0, md: 0 }}>
        <ProjectFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />
        <Card w="100%" style={boxShadow} borderRadius={'6px'}>
          <Box border="1px solid #CBD5E0" borderRadius="6px">
            <ProjectsTable selectedCard={selectedCard as string} />
          </Box>
        </Card>
      </VStack>
    </>
  )
}

export default Projects
