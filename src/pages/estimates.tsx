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
import { EstimateFilters } from 'features/estimates/estimate-filters/estimate-filters'
import { EstimatesTable } from 'features/estimates/estimates-table'
import { AddNewEstimateModal } from 'features/estimates/new-estimate/add-estimate'
import { WeekDayFilters } from 'features/common/due-projects-weekly-filter/weekday-filters'
import { BiBookAdd, BiChevronRight, BiChevronDown } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { useUserRolesSelector } from 'utils/redux-common-selectors'
import ReactSelect from 'components/form/react-select'
import { useFPMUsers } from 'api/pc-projects'
import { useStickyState } from 'utils/hooks'
import { Card } from 'components/card/card'

const formatGroupLabel = props => (
  <Box onClick={props.onClick} cursor="pointer" display="flex" alignItems="center" fontWeight="normal" ml={'-7px'}>
    {props.isHidden ? <BiChevronRight fontSize={'20px'} /> : <BiChevronDown fontSize={'20px'} />} {props.label}
  </Box>
)

export const Estimates = () => {
  const {
    isOpen: isOpenNewProjectModal,
    onClose: onNewProjectModalClose,
    onOpen: onNewProjectModalOpen,
  } = useDisclosure()
  const { isFPM } = useUserRolesSelector()
  const { fpmUsers = [], setSelectedFPM, selectedFPM, userIds } = useFPMUsers()

  const [resetAllFilters, setResetAllFilters] = useState(false)
  const [selectedCard, setSelectedCard] = useStickyState(null, 'project.selectedCard')
  const [selectedDay, setSelectedDay] = useStickyState(null, 'project.selectedDay')

  const { t } = useTranslation()

  const clearAll = () => {
    setResetAllFilters(true)
    setTimeout(() => {
      setResetAllFilters(false)
    }, 700)
    setSelectedCard('')
    setSelectedDay('')
  }

  return (
    <>
      <VStack alignItems="start" minH="calc(100vh - 160px)" pb="2">
        <Box w="100%" mb="5px">
          <EstimateFilters
            onSelectCard={selection => {
              setSelectedDay(null)
              setSelectedCard(selection)
            }}
            selectedCard={selectedCard}
            selectedFPM={selectedFPM}
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
              {t('estimates.dueEstimates')}
            </FormLabel>
            <Box ml="2">
              <Divider orientation="vertical" borderColor="#A0AEC0" h="23px" />
            </Box>

            <WeekDayFilters
              selectedFPM={selectedFPM}
              clear={clearAll}
              onSelectDay={selection => {
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
                {t('estimates.newEstimates')}
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
            <EstimatesTable
              selectedCard={selectedCard as string}
              selectedDay={selectedDay as string}
              userIds={userIds}
              selectedFPM={selectedFPM}
              resetFilters={resetAllFilters}
            />
          </Box>
        </Card>
      </VStack>
      <AddNewEstimateModal isOpen={isOpenNewProjectModal} onClose={onNewProjectModalClose} />
    </>
  )
}
