import {
  Box,
  // Button, Center, Divider, Flex, Stack,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
// import { useTranslation } from 'react-i18next'
// import { BsBoxArrowUp } from 'react-icons/bs'
// import TableColumnSettings from '../components/table/table-column-settings'
import { ProjectFilters } from '../features/projects/pc-project-fliters'
// import {
//    ProjectsTable,
//   PROJECT_COLUMNS,
// } from '../features/projects/projects-table'
// import { TableNames } from '../types/table-column.types'
// import {
//   // useTableColumnSettings,
//   useTableColumnSettingsUpdateMutation,
// } from 'utils/table-column-settings'
// import { BlankSlate } from 'components/skeletons/skeleton-unit'

export const PCProjects = () => {
  // const { t } = useTranslation()
  // const [projectTableInstance, setInstance] = useState<any>(null)
  // const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  // const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
  //   PROJECT_COLUMNS,
  //   TableNames.project,
  // )
  const [selectedCard, setSelectedCard] = useState<string>('')
  // const setProjectTableInstance = tableInstance => {
  //   setInstance(tableInstance)
  // }

  // const onSave = columns => {
  //   postProjectColumn(columns)
  // }

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
