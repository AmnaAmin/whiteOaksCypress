import { Box, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ProjectFilters } from 'features/vendor/projects/project-fliters'
import { ProjectsTable } from 'features/vendor/projects/projects-table'

const Projects = () => {
  const [selectedCard, setSelectedCard] = useState<string>('')

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
