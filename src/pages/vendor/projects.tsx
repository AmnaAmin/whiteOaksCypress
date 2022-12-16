import { Box, VStack } from '@chakra-ui/react'
import { useEffect } from 'react'
import { ProjectFilters } from 'features/vendor/projects/project-fliters'
import { ProjectsTable } from 'features/vendor/projects/projects-table'
import { useLocation } from 'react-router-dom'
import { useStickyState } from 'utils/hooks'

const Projects = () => {
  const [selectedCard, setSelectedCard] = useStickyState(null, 'project.selectedCard');

  const { state } = useLocation()
  useEffect(() => {
    if (state) {
      setSelectedCard(`${state}`)
    }
  }, [state])

  return (
    <>
      <VStack spacing="14px" w="100%">
        <ProjectFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />
        <Box w="100%">
          <ProjectsTable selectedCard={selectedCard as string} />
        </Box>
      </VStack>
    </>
  )
}

export default Projects
