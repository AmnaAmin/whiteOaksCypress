import { Box, VStack } from '@chakra-ui/react'
import { useState } from 'react'
import { ProjectFilters } from '../features/projects/pc-project-fliters'
// import { PROJECT_COLUMNS } from '../features/projects/projects-table'
// import { TableNames } from '../types/table-column.types'
// import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'

export const PCProjects = () => {
  // const [setInstance] = useState<any>(null)
  // const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  // const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
  //   PROJECT_COLUMNS,
  //   TableNames.project,
  // )
  const [selectedCard, setSelectedCard] = useState<string>('')

  return (
    <>
      <VStack w="100%" h="calc(100vh - 160px)">
        <Box mb={2} w="100%">
          <ProjectFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />
        </Box>
      </VStack>
    </>
  )
}
