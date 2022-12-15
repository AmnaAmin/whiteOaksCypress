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
import { BiBookAdd, BiChevronRight, BiChevronDown } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import ReactSelect from 'components/form/react-select'
import { useFPMUsers } from 'api/pc-projects'
import { useStickyState } from 'utils/hooks'

const formatGroupLabel = props => (
  <Box onClick={props.onClick} cursor="pointer" display="flex" alignItems="center" fontWeight="normal" ml={'-7px'}>
    {props.isHidden ? <BiChevronRight fontSize={'20px'} /> : <BiChevronDown fontSize={'20px'} />} {props.label}
  </Box>
)

export const Projects = () => {
  const {
    isOpen: isOpenNewProjectModal,
    onClose: onNewProjectModalClose,
    onOpen: onNewProjectModalOpen,
  } = useDisclosure()
  const { isFPM } = useUserRolesSelector()
  const { fpmUsers = [], setSelectedFPM, selectedFPM, userIds } = useFPMUsers()

  const [selectedCard, setSelectedCard] = useStickyState(null, 'project.selectedCard');
  const [selectedDay, setSelectedDay] = useStickyState(null, 'project.selectedDay');

  const { t } = useTranslation()

  const clearAll = () => {
    setSelectedCard('')
    setSelectedDay('')
  }

  return (
    <>
      <VStack alignItems="start" h="calc(100vh - 160px)">
        <Box w="100%">
          <ProjectFilters onSelectCard={(selection) => {
              setSelectedDay(null)
              setSelectedCard(selection)
            }}
            selectedCard={selectedCard}
            selectedFPM={selectedFPM}
          />
        </Box>
        <Flex w="100%" py="16px" alignItems={'center'}>
          {/* <Flex alignItems="center" pl={2}> */}
          <FormLabel variant="strong-label" size="lg" whiteSpace="nowrap" m="0">
            {t('projects.dueProjects')}
          </FormLabel>
          <Box ml="2">
            <Divider orientation="vertical" borderColor="#A0AEC0" h="23px" />
          </Box>

          <WeekDayFilters
            selectedFPM={selectedFPM}
            clear={clearAll}
            onSelectDay={(selection) => {
              setSelectedCard(null)
              setSelectedDay(selection)
            }}
            selectedDay={selectedDay}
          />
          {/* </Flex> */}
          <Spacer />
          {!isFPM && (
            <Button onClick={onNewProjectModalOpen} colorScheme="brand" fontSize="14px" minW={'140px'}>
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
                placeholder={'Select'}
                selectProps={{ isBorderLeft: true }}
                styleOption={{ paddingLeft: '40px' }}
              />
            </FormControl>
          )}
        </Flex>
        <Box w="100%" minH="500px">
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
