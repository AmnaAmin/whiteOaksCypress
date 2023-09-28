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
import { BiBookAdd, BiChevronRight, BiChevronDown } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { useRoleBasedPermissions, useUserRolesSelector } from 'utils/redux-common-selectors'
import ReactSelect from 'components/form/react-select'
import { useDirectReports, useFPMUsers } from 'api/pc-projects'
import { useStickyState } from 'utils/hooks'
import { Card } from 'components/card/card'

import { useAccountData } from 'api/user-account'

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

  const hideCreateProject = useRoleBasedPermissions()?.permissions?.some(p =>
    ['PROJECT.CREATE.HIDE', 'PROJECT.READ']?.includes(p),
  )
  const { setSelectedFPM, selectedFPM, userIds } = useFPMUsers()
  const { data } = useAccountData()
  const { directReportOptions = [], isLoading: loadingReports } = useDirectReports(data?.email)

  const [resetAllFilters, setResetAllFilters] = useState(false)
  const [selectedCard, setSelectedCard] = useStickyState(null, 'project.selectedCard')
  const [selectedDay, setSelectedDay] = useStickyState(null, 'project.selectedDay')

  const [selectedFlagged, setSelectedFlagged] = useState<string | null>()

  const { t } = useTranslation()

  const clearAll = () => {
    setResetAllFilters(true)
    setTimeout(() => {
      setResetAllFilters(false)
    }, 2000)
    setSelectedCard('')
    setSelectedDay('')
    setSelectedFlagged('')
  }

  return (
    <>
      <VStack alignItems="start" minH="calc(100vh - 160px)" pb="2">
        <Box w="100%" mb="5px">
          <ProjectFilters
            clear={() => {
              setSelectedCard('')
            }}
            onSelectCard={selection => {
              setSelectedFlagged(null)
              setSelectedCard(selection)
            }}
            selectedCard={selectedCard}
            selectedFPM={selectedFPM}
            onSelectFlagged={selection => {
              setSelectedCard(null)
              setSelectedFlagged(selection)
            }}
            selectedFlagged={selectedFlagged}
          />
        </Box>
        <Card
          w="100%"
          py="14px"
          px="14px"
          boxShadow="0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)"
        >
          <Flex w="100%" mb="14px" alignItems={'center'}>
            {/* <Flex alignItems="center" pl={2}> */}
            <FormLabel variant="strong-label" size="lg" whiteSpace="nowrap" m="0">
              {t('projects.dueProjects')}
            </FormLabel>
            <Box ml="2">
              <Divider orientation="vertical" borderColor="#A0AEC0" h="23px" />
            </Box>
            <WeekDayFilters
              selectedFPM={selectedFPM}
              clearAll={clearAll}
              clear={() => {
                setSelectedDay('')
              }}
              onSelectDay={selection => {
                setSelectedDay(selection)
              }}
              selectedDay={selectedDay}
            />

            <Spacer />
            <FormControl w="215px" mr={'10px'}>
              <ReactSelect
                formatGroupLabel={formatGroupLabel}
                onChange={setSelectedFPM}
                options={directReportOptions}
                loadingCheck={loadingReports}
                placeholder={'Select'}
              />
            </FormControl>
            {!hideCreateProject && (
              <Button onClick={onNewProjectModalOpen} colorScheme="brand" fontSize="14px" minW={'140px'}>
                <Icon as={BiBookAdd} fontSize="18px" mr={2} />
                {t('projects.newProjects')}
              </Button>
            )}
            {/*change this logic based on access control requirements*/}
          </Flex>
          <Box w="100%" minH="500px">
            <ProjectsTable
              selectedCard={selectedCard as string}
              selectedDay={selectedDay as string}
              userIds={userIds}
              selectedFPM={selectedFPM}
              resetFilters={resetAllFilters}
              selectedFlagged={selectedFlagged}
            />
          </Box>
        </Card>
      </VStack>
      <AddNewProjectModal isOpen={isOpenNewProjectModal} onClose={onNewProjectModalClose} />
    </>
  )
}
