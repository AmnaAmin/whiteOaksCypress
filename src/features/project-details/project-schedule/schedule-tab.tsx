import { Flex, FormLabel } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import ProjectSchedule from './project-schedule'

export const ScheduleTab = ({ data, isLoading }) => {
  const { t } = useTranslation()
  return (
    <>
      {data?.length > 0 ? (
        <ProjectSchedule isLoading={isLoading} data={data} />
      ) : (
        <Flex h="calc(100vh - 450px)" bg="#fff" justifyContent={'center'}>
          <FormLabel display={'flex'} alignItems="center" variant="light-label">
            {t('noDataDisplayed')}
          </FormLabel>
        </Flex>
      )}
    </>
  )
}

export default ScheduleTab
