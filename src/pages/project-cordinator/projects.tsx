import { Box, Button, Center, Divider, Flex, FormLabel, Icon, Stack, useDisclosure, VStack } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsBoxArrowUp } from 'react-icons/bs'
import TableColumnSettings from 'components/table/table-column-settings'
import { ProjectFilters } from 'features/project-coordinator/project-filters'
import { ProjectsTable, PROJECT_COLUMNS } from 'features/project-coordinator/projects-table'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { AddNewProjectModal } from 'features/project-coordinator/add-project'
import { WeekDayFilters } from 'features/project-coordinator/weekday-filters'
import { BiBookAdd } from 'react-icons/bi'

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
  const [selectedDay, setSelectedDay] = useState<string>('')

  const [isClicked, setIsClicked] = useState(false)

  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }

  const onSave = columns => {
    postProjectColumn(columns)
  }

  useEffect(() => {
    setSelectedDay('All')
    setSelectedCard('')
    setIsClicked(true)
  }, [])

  const clearAll = () => {
    setSelectedDay('')
    setIsClicked(false)
    setSelectedCard('')
  }

  const allDays = () => {
    setSelectedDay('All')
    setSelectedCard('')
    setIsClicked(true)
  }

  const clearSelected = () => {
    setIsClicked(false)
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
              Due Projects
            </FormLabel>
          </Box>{' '}
        </Stack>
        <Stack w={{ base: '971px', xl: '100%' }} direction="row" marginTop={1} paddingLeft={2}>
          <Button
            bg={isClicked ? '#4E87F8' : 'none'}
            color={isClicked ? 'white' : 'black'}
            _hover={{ bg: '#4E87F8', color: 'white', border: 'none' }}
            _focus={{ border: 'none' }}
            fontSize="16px"
            fontStyle="normal"
            fontWeight={500}
            alignContent="right"
            onClick={allDays}
            rounded={20}
            p={0}
            mt={1}
          >
            All
          </Button>
          <Box onClick={clearSelected}>
            <WeekDayFilters onSelectDay={setSelectedDay} selectedDay={selectedDay} />
          </Box>
          <Button
            bg="none"
            color="#4E87F8"
            _hover={{ bg: 'none' }}
            _focus={{ border: 'none' }}
            fontSize="16px"
            fontStyle="inter"
            fontWeight={600}
            alignContent="right"
            onClick={clearAll}
            pt={2}
            pl={1}
          >
            Clear Filter
          </Button>
          <Button
            alignContent="right"
            onClick={onNewProjectModalOpen}
            position="absolute"
            right={8}
            colorScheme="brand"
            fontSize="14px"
          >
            <Icon as={BiBookAdd} fontSize="18px" mr={2} />
            New Project
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
