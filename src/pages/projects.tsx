import { useState } from 'react'
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  FormLabel,
  Icon,
  Stack,
  useDisclosure,
  VStack,
  Spacer,
  FormControl,
} from '@chakra-ui/react'
import { BsBoxArrowUp } from 'react-icons/bs'
import TableColumnSettings from 'components/table/table-column-settings'
import { ProjectFilters } from 'features/projects/project-filters/project-filters'
import { ProjectsTable, PROJECT_COLUMNS } from 'features/projects/projects-table'
import { TableNames } from 'types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'api/table-column-settings'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import { AddNewProjectModal } from 'features/projects/new-project/add-project'
import { WeekDayFilters } from 'features/common/due-projects-weekly-filter/weekday-filters'
import { BiBookAdd, BiChevronRight, BiChevronDown } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { exportBtnIcon } from 'theme/common-style'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import ReactSelect from 'components/form/react-select'
import { useFPMUsers } from 'api/pc-projects'

const formatGroupLabel = props => (
  <Box onClick={props.onClick} display="flex" alignItems="center" fontWeight="normal" ml={'-15px'}>
    {props.isHidden ? <BiChevronRight fontSize={'20px'} /> : <BiChevronDown fontSize={'20px'} />} {props.label}
  </Box>
)

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
  const { isFPM } = useUserRolesSelector()
  const { fpmUsers = [], setSelectedFPM, selectedFPM, usersId } = useFPMUsers()
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<string>('')
  const { t } = useTranslation()

  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  const onSave = columns => {
    postProjectColumn(columns)
  }

  const clearAll = () => {
    setSelectedCard('')
    setSelectedDay('')
  }

  return (
    <>
      <VStack alignItems="start" h="calc(100vh - 160px)">
        <Box w="100%">
          <ProjectFilters onSelectCard={setSelectedCard} selectedCard={selectedCard} selectedFPM={selectedFPM} />
        </Box>
        <Flex w="100%" py="16px">
          <Flex alignItems="center" pl={2}>
            <FormLabel variant="strong-label" size="lg" whiteSpace="nowrap" m="0">
              {t('Due Projects')}
            </FormLabel>
            <Box ml="2">
              <Divider orientation="vertical" borderColor="#A0AEC0" h="23px" />
            </Box>

            <WeekDayFilters
              selectedFPM={selectedFPM}
              clear={clearAll}
              onSelectDay={setSelectedDay}
              selectedDay={selectedDay}
            />
          </Flex>
          <Spacer />
          {!isFPM && (
            <Button onClick={onNewProjectModalOpen} colorScheme="brand" fontSize="14px">
              <Icon as={BiBookAdd} fontSize="18px" mr={2} />
              {t('New Project')}
            </Button>
          )}
          {fpmUsers?.length > 0 && isFPM && (
            <FormControl w="215px">
              <ReactSelect
                formatGroupLabel={formatGroupLabel}
                onChange={setSelectedFPM}
                options={fpmUsers}
                menuIsOpen
                placeholder={'Select'}
                selectProps={{ isBorderLeft: true }}
              />
            </FormControl>
          )}
        </Flex>
        <Box w="100%" minH="500px" boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
          <ProjectsTable
            selectedCard={selectedCard as string}
            selectedDay={selectedDay as string}
            setTableInstance={setProjectTableInstance}
            resizeElementRef={resizeElementRef}
            projectColumns={tableColumns}
            usersId={usersId}
            selectedFPM={selectedFPM}
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
                    <Icon as={BsBoxArrowUp} style={exportBtnIcon} mr={1} />
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
      <AddNewProjectModal isOpen={isOpenNewProjectModal} onClose={onNewProjectModalClose} />
    </>
  )
}
