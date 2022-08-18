import { Box, Center, Divider, Flex, FormLabel, Icon, Stack } from '@chakra-ui/react'
import { DevTool } from '@hookform/devtools'
import { Button } from 'components/button/button'
import { ConfirmationBox } from 'components/Confirmation'
import { ReceivableFilter } from 'features/project-coordinator/payable-recievable/receivable-filter'
import { ReceivableTable } from 'features/project-coordinator/payable-recievable/receivable-table'
import { AccountWeekDayFilters } from 'features/project-coordinator/weekly-filter-accounts-details'
import { t } from 'i18next'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { BiExport, BiSync } from 'react-icons/bi'
import { FaAtom } from 'react-icons/fa'
import { useBatchProcessingMutation, useCheckBatch } from 'utils/account-receivable'

export const Receivable = () => {
  const [projectTableInstance, setInstance] = useState<any>(null)

  const [loading, setLoading] = useState(false)
  const [isBatchClick, setIsBatchClick] = useState(false)
  const [selectedCard, setSelectedCard] = useState<string>('')
  const [selectedDay, setSelectedDay] = useState<string>('')
  // const [cardSelected, setCardSelected] = useState(false)

  const clearAll = () => {
    setSelectedCard('')
    setSelectedDay('')
  }

  const setProjectTableInstance = tableInstance => {
    setInstance(tableInstance)
  }
  const { handleSubmit, register, control } = useForm<{ projects: boolean[] }>({
    defaultValues: {
      projects: [],
    },
  })

  const { mutate: batchCall } = useBatchProcessingMutation()

  const Submit = formValues => {
    setLoading(true)
    setIsBatchClick(true)

    const payloadData = formValues.projects.map(projectId => ({ id: parseInt(projectId), type: 'Remaining Payments' }))
    const obj = {
      typeCode: 'AR',
      entities: payloadData,
    }
    batchCall(obj as any)
    // batchCall?.(obj) not working
  }

  useCheckBatch(setLoading, 2)

  const onNotificationClose = () => {
    setIsBatchClick(false)
  }

  return (
    <>
      <form onSubmit={handleSubmit(Submit)}>
        <Box>
          <FormLabel variant="strong-label" size="lg">
            {t('Account Receivable')}
          </FormLabel>
          <Box>
            <ReceivableFilter onSelected={setSelectedCard} cardSelected={selectedCard} />
          </Box>
          <Box mt={6}>
            <FormLabel variant="strong-label" size="lg">
              {t('dueProjects')}
            </FormLabel>
          </Box>
          <Stack w={{ base: '971px', xl: '100%' }} direction="row" spacing={1} marginTop={1} mb={3}>
            <AccountWeekDayFilters onSelectDay={setSelectedDay} selectedDay={selectedDay} clear={clearAll} />

            <Button
              alignContent="right"
              // onClick={onNewProjectModalOpen}
              position="absolute"
              right={8}
              colorScheme="brand"
              type="submit"
            >
              <Icon as={BiSync} fontSize="18px" mr={2} />
              {!loading ? 'Batch Process' : 'Processing...'}
            </Button>
          </Stack>
          <Divider border="2px solid #E2E8F0" />
          <Box mt={2}>
            <ReceivableTable
              loading={loading}
              register={register}
              selectedCard={selectedCard as string}
              selectedDay={selectedDay as string}
              setTableInstance={setProjectTableInstance}
            />
          </Box>

          <Stack w={{ base: '971px', xl: '100%' }} direction="row" justify="flex-end" spacing={5} pb={4}>
            <Flex borderRadius="0 0 6px 6px" bg="#F7FAFC" border="1px solid #E2E8F0">
              <Button
                m={0}
                colorScheme="brand"
                variant="ghost"
                onClick={() => {
                  if (projectTableInstance) {
                    projectTableInstance?.exportData('xlsx', false)
                  }
                }}
              >
                <Icon as={BiExport} fontSize="18px" mr={1} />
                {t('export')}
              </Button>
              <Center>
                <Divider orientation="vertical" height="25px" border="1px solid" />
              </Center>
              <Button colorScheme="brand" variant="ghost" m={0}>
                <Icon as={FaAtom} fontSize="18px" mr={1} />
                {t('setting')}
              </Button>
            </Flex>
          </Stack>
        </Box>
        <ConfirmationBox
          title="Batch processing"
          content="Batch Process has been completed successfully."
          isOpen={!loading && isBatchClick}
          onClose={onNotificationClose}
          onConfirm={onNotificationClose}
          yesButtonText="Cancel"
          showNoButton={false}
        />
      </form>
      <DevTool control={control} />
    </>
  )
}
