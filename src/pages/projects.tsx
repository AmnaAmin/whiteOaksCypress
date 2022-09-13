import { useState } from 'react'
import {
  Box,
  Button,
  Divider,
  Flex,
  FormLabel,
  Icon,
  useDisclosure,
  VStack,
  Spacer,
  FormControl,
} from '@chakra-ui/react'
import { ProjectFilters } from 'features/projects/project-filters/project-filters'
import { ProjectsTable } from 'features/projects/projects-table'
import { AddNewProjectModal } from 'features/projects/new-project/add-project'
import { WeekDayFilters } from 'features/common/due-projects-weekly-filter/weekday-filters'
import { BiBookAdd } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import ReactSelect from 'components/form/react-select'
import { useFPMUsers } from 'api/pc-projects'

export const Projects = () => {
  const {
    isOpen: isOpenNewProjectModal,
    onClose: onNewProjectModalClose,
    onOpen: onNewProjectModalOpen,
  } = useDisclosure()
  const { isFPM } = useUserRolesSelector()
  const { fpmUsers = [], setSelectedFPM, selectedFPM, userIds } = useFPMUsers()
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<string>('')
  const { t } = useTranslation()

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
                onChange={setSelectedFPM}
                options={fpmUsers}
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
            userIds={userIds}
            selectedFPM={selectedFPM}
          />
        </Box>
      </VStack>
      <AddNewProjectModal isOpen={isOpenNewProjectModal} onClose={onNewProjectModalClose} />
    </>
  )
}
