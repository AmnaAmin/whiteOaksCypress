import { Box, Button, Center, Divider, Flex, HStack, VStack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsBoxArrowUp } from 'react-icons/bs'
import TableColumnSettings from 'components/table/table-column-settings'
import { ProjectFilters } from 'features/vendor/projects/project-fliters'
import { ProjectsTable, PROJECT_COLUMNS } from 'features/vendor/projects/projects-table'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { useLocation } from 'react-router-dom'

const Projects = () => {
  const { t } = useTranslation()
  const [projectTableInstance, setInstance] = useState<any>(null)
  const { mutate: postGridColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
    PROJECT_COLUMNS,
    TableNames.project,
  )
  const [selectedCard, setSelectedCard] = useState<string>('')
  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }

  const onSave = columns => {
    postGridColumn(columns)
  }
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
          <ProjectsTable
            selectedCard={selectedCard as string}
            setTableInstance={setProjectTableInstance}
            resizeElementRef={resizeElementRef}
            projectColumns={tableColumns}
          />
          <HStack justify="flex-end">
            <Flex borderRadius="0 0 6px 6px" bg="#F7FAFC" border="1px solid #E2E8F0" mt="2px">
              {isLoading ? (
                <>
                  <BlankSlate size="md" />
                  <BlankSlate size="md" />
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    colorScheme="brand"
                    onClick={() => {
                      if (projectTableInstance) {
                        projectTableInstance?.exportData('xlsx', false)
                      }
                    }}
                  >
                    <Box pos="relative" right="6px" fontWeight="bold" pb="3.3px">
                      <BsBoxArrowUp />
                    </Box>
                    {t('export')}
                  </Button>
                  <Center>
                    <Divider orientation="vertical" height="25px" border="1px solid" />
                  </Center>
                  {settingColumns && (
                    <TableColumnSettings disabled={isLoading} onSave={onSave} columns={settingColumns} />
                  )}
                </>
              )}
            </Flex>
          </HStack>
        </Box>
      </VStack>
    </>
  )
}

export default Projects
