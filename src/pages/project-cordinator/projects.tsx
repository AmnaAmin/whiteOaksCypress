import { useEffect, useState } from 'react'
import { Box, Button, Center, Divider, Flex, FormLabel, Icon, Stack, useDisclosure, VStack } from '@chakra-ui/react'
import { BsBoxArrowUp } from 'react-icons/bs'
import TableColumnSettings from 'components/table/table-column-settings'
import { ProjectFilters } from 'features/project-coordinator/project-filters'
import { ProjectsTable, PROJECT_COLUMNS } from 'features/project-coordinator/projects-table'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { AddNewProjectModal } from 'features/project-coordinator/add-project'
import { useClients, useFPM, useMarkets, usePC, useProjectTypes, useProperties, useStates } from 'utils/pc-projects'
import { WeekDayFilters } from 'features/project-coordinator/weekday-filters'
import { BiBookAdd } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'

export const Projects = () => {
  const {
    isOpen: isOpenNewProjectModal,
    onClose: onNewProjectModalClose,
    onOpen: onNewProjectModalOpen,
  } = useDisclosure()
  const [projectTableInstance, setInstance] = useState<any>(null)
  const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.pcproject)
  const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
    PROJECT_COLUMNS,
    TableNames.pcproject,
  )
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<string>('')
  const { t } = useTranslation()

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

  const clearSelected = () => {
    setSelectedCard('')
  }

  return (
    <>
      <VStack w="100%" h="calc(100vh - 160px)">
        <Box mb={2} w="100%" border="10 px solid red">
          <ProjectFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} />
        </Box>
        <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="left" marginTop={10}>
          <Box mt={4}>
            <FormLabel variant="strong-label" fontSize="18px">
              {t('Due Projects')}
            </FormLabel>
          </Box>{' '}
        </Stack>
        <Stack w={{ base: '971px', xl: '100%' }} direction="row" marginTop={1} paddingLeft={2}>
          <Box onClick={clearSelected}>
            <WeekDayFilters onSelectDay={setSelectedDay} selectedDay={selectedDay} />
          </Box>
          <Button
            alignContent="right"
            onClick={onNewProjectModalOpen}
            position="absolute"
            right={8}
            colorScheme="brand"
            fontSize="14px"
          >
            <Icon as={BiBookAdd} fontSize="18px" mr={2} />
            {t('New Project')}
          </Button>
        </Stack>
        <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="flex-end" spacing={5}></Stack>
        <Box w="100%" minH="500px" boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
          <ProjectsTable
            selectedCard={selectedCard as string}
            selectedDay={selectedDay as string}
            setTableInstance={setProjectTableInstance}
            resizeElementRef={resizeElementRef}
            projectColumns={tableColumns}
          />
          <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="flex-end" spacing={5} pb={3}>
            <Flex borderRadius="0 0 6px 6px" bg="#F7FAFC" border="1px solid #E2E8F0">
              {isLoading ? (
                <>
                  <BlankSlate size="md" />
                  <BlankSlate size="md" />
                </>
              ) : (
                <>
                  <Button
                    m={0}
                    variant="ghost"
                    colorScheme="brand"
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
                    <Icon as={BsBoxArrowUp} fontSize="18px" mr={1} />

                    {/* <Box pos="relative" right="6px" fontWeight="bold" pb="3.3px">
                      <BsBoxArrowUp />
                    </Box> */}
                    {'Export'}
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
      <AddNewProjectModal
        markets={markets}
        properties={properties}
        projectTypes={projectTypes}
        statesData={statesData}
        fieldProjectManager={fieldProjectManager}
        projectCoordinator={projectCoordinator}
        client={client}
        isOpen={isOpenNewProjectModal}
        onClose={onNewProjectModalClose}
      />
    </>
  )
}
