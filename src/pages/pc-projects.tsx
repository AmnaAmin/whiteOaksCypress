import {
  background,
  Box,
  Button,
  Center,
  Divider,
  Flex,
  HStack,
  Radio,
  RadioGroup,
  Stack,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BsBoxArrowUp } from 'react-icons/bs'
import TableColumnSettings from '../components/table/table-column-settings'
import { ProjectFilters } from '../features/projects/pc-project-filters'
import { ProjectsTable, PROJECT_COLUMNS } from '../features/projects/pc-projects-table'
import { TableNames } from '../types/table-column.types'
import { useTableColumnSettings, useTableColumnSettingsUpdateMutation } from 'utils/table-column-settings'
import { BlankSlate } from 'components/skeletons/skeleton-unit'
import PlusIcon from 'icons/plus-icon'
import { ProjectDayFilters } from 'features/projects/pc-project-days-filters'

export const PCProjects = () => {
  const { t } = useTranslation()
  const [projectTableInstance, setInstance] = useState<any>(null)
  const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(TableNames.project)
  const { tableColumns, resizeElementRef, settingColumns, isLoading } = useTableColumnSettings(
    PROJECT_COLUMNS,
    TableNames.project,
  )
  const [selectedCard, setSelectedCard] = useState<string>('')
  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }

  const onSave = columns => {
    postProjectColumn(columns)
  }
 
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
            position="absolute"
            right="8"
          >
            Clear Filter
          </Button>
        </Stack>
        <Divider></Divider>
        <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="flex-end" spacing={5} marginTop={1}>
          <Button
            bg="none"
            color="#4E87F8"
            _hover={{ bg: 'none' }}
            _focus={{ border: 'none' }}
            fontSize="12px"
            fontStyle="normal"
            fontWeight={500}
            alignContent="right"
          >
            <Box pos="relative" fontWeight="bold" p="2px">
              <PlusIcon />
            </Box>
            New Project
          </Button>
        </Stack>
        <Divider></Divider>
        <br></br>
        <Box w="100%" flex={1} boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
          <ProjectsTable
            selectedCard={selectedCard as string}
            setTableInstance={setProjectTableInstance}
            resizeElementRef={resizeElementRef}
            projectColumns={tableColumns}
          />
        </Box>
      </VStack>
    </>
  )
}
