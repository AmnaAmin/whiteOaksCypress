import { Box, Button, Center, Divider, Flex, Stack, useDisclosure, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsBoxArrowUp } from 'react-icons/bs'
import TableColumnSettings from 'components/table/table-column-settings'
import { ProjectFilters } from 'features/project-coordinator/project-filters'
import { ProjectsTable, PROJECT_COLUMNS } from 'features/project-coordinator/projects-table'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import PlusIcon from 'icons/plus-icon'
import { ProjectDayFilters } from 'features/project-coordinator/project-days-filters'
import { AddNewProjectModal } from 'features/project-coordinator/add-project'
import { useClients, useFPM, useMarkets, usePC, useProjectTypes, useProperties, useStates } from 'utils/pc-projects'

export const Projects = () => {
  const { t } = useTranslation()

  const {
    isOpen: isOpenNewProjectModal,
    onClose: onNewProjectModalClose,
    onOpen: onNewProjectModalOpen,
  } = useDisclosure()
  const [projectTableInstance, setInstance] = useState<any>(null)
  const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
    PROJECT_COLUMNS,
    TableNames.pcproject,
  )
  const [selectedCard, setSelectedCard] = useState<string>('')
  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  const onSave = columns => {
    postProjectColumn(columns)
  }

  // Calling all APIs
  const { data: properties } = useProperties()
  const { data: projectTypes } = useProjectTypes()
  const { data: statesData } = useStates()
  const { data: fieldProjectManager } = useFPM()
  const { data: projectCoordinator } = usePC()
  const { data: client } = useClients()
  const { data: markets } = useMarkets()

  useEffect(() => {}, [properties, projectTypes, statesData, fieldProjectManager, projectCoordinator, client, markets])

  return (
    <>
      <VStack w="100%" h="calc(100vh - 160px)">
        <Box mb={2} w="100%" border="10 px solid red">
          <ProjectFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />
        </Box>
        <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="left" marginTop={10}>
          <Box fontWeight={'bold'}>Due Projects</Box>
        </Stack>
        <Stack w={{ base: '971px', xl: '100%' }} direction="row" spacing={1} marginTop={1}>
          <ProjectDayFilters />
          <Button
            bg="none"
            color="#4E87F8"
            _hover={{ bg: 'none' }}
            _focus={{ border: 'none' }}
            fontSize="12px"
            fontStyle="normal"
            fontWeight={500}
            alignContent="right"
            onClick={onNewProjectModalOpen}
            position="absolute"
            right={8}
          >
            <Box pos="relative" fontWeight="bold" p="2px">
              <PlusIcon />
            </Box>
            New Project
          </Button>
        </Stack>
        <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="flex-end" spacing={5} marginTop={1}></Stack>
        <Divider></Divider>
        <br></br>
        <Box w="100%" flex={1} boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
          <ProjectsTable
            selectedCard={selectedCard as string}
            setTableInstance={setProjectTableInstance}
            resizeElementRef={resizeElementRef}
            projectColumns={tableColumns}
          />
          <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="flex-end" spacing={5} marginTop={1}>
            <Flex borderRadius="0 0 6px 6px" bg="#F7FAFC" border="1px solid #E2E8F0">
              {isLoading ? (
                <>
                  <BlankSlate size="md" />
                  <BlankSlate size="md" />
                </>
              ) : (
                <>
                  <Button
                    bg="none"
                    color="#4E87F8"
                    _hover={{ bg: 'none' }}
                    _focus={{ border: 'none' }}
                    fontSize="12px"
                    fontStyle="normal"
                    fontWeight={500}
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
          </Stack>
        </Box>
      </VStack>
      <AddNewProjectModal isOpen={isOpenNewProjectModal} onClose={onNewProjectModalClose} />
    </>
  )
}
