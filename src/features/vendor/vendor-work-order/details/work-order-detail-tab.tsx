import {
  Box,
  HStack,
  Flex,
  SimpleGrid,
  FormLabel,
  ModalFooter,
  ModalBody,
  Alert,
  AlertDescription,
  AlertIcon,
  Center,
  Spinner,
  Icon,
  useToast,
} from '@chakra-ui/react'
import { BiCalendar, BiDownload, BiFile } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'
import { Button } from 'components/button/button'
import { dateFormatNew } from 'utils/date-time-utils'
import jsPDF from 'jspdf'
import { useUpdateWorkOrderMutation } from 'api/work-order'
import AssignedItems from 'features/work-order/details/assigned-items'
import { useFieldArray, useForm, UseFormReturn } from 'react-hook-form'
import { createInvoicePdf, LineItems } from 'features/work-order/details/assignedItems.utils'
import { useEffect, useMemo, useState } from 'react'
import { STATUS } from '../../../common/status'
import { WORK_ORDER } from 'features/work-order/workOrder.i18n'
import { NEW_PROJECT } from 'features/vendor/projects/projects.i18n'
import { downloadFile } from 'utils/file-utils'

const SummaryCard = props => {
  return (
    <Flex justifyContent={'left'}>
      <Box pr={4}>
        <Icon as={props.icon} fontSize="23px" color="#4A5568" />
      </Box>
      <Box lineHeight="20px">
        <FormLabel variant="strong-label" size="md" isTruncated>
          {props.title}
        </FormLabel>
        <FormLabel data-testid={props.title} variant="light-label" size="md" isTruncated>
          {props.value}
        </FormLabel>
      </Box>
    </Flex>
  )
}

interface FormValues {
  assignedItems?: LineItems[]
  showPrice?: boolean
}

const WorkOrderDetailTab = ({
  documentsData,
  onClose,
  workOrder,
  projectData,
  setIsUpdating,
  isUpdating,
  workOrderAssignedItems,
  isFetchingLineItems,
  isLoadingLineItems,
  displayAwardPlan,
  tabIndex,
  setIsError,
  locations,
}) => {
  const { t } = useTranslation()
  const toast = useToast()
  const [uploadedWO, setUploadedWO] = useState<any>(null)
  const { mutate: updateWorkOrderDetails } = useUpdateWorkOrderMutation({
    setUpdating: () => {
      setIsUpdating(false)
    },
  })
  const getDefaultValues = locations => {
    return {
      assignedItems:
        workOrderAssignedItems?.length > 0
          ? workOrderAssignedItems?.map(e => {
              const locationFound = locations?.find(l => l.value === e?.location)
              let location
              if (locationFound) {
                location = { label: locationFound.value, value: locationFound.id }
              } else if (!!e.location) {
                location = { label: e?.location, value: e?.location }
              } else {
                location = null
              }
              return { ...e, uploadedDoc: null, clientAmount: e.price ?? 0 * e.quantity ?? 0, location }
            })
          : [],
      showPrice: workOrder.showPricing,
      // notifyVendor: workOrder.notifyVendor,
    }
  }

  const defaultValues: FormValues = useMemo(() => {
    return getDefaultValues(locations)
  }, [workOrder, workOrderAssignedItems?.length, locations])

  const formReturn = useForm<FormValues>({
    defaultValues: {
      ...defaultValues,
    },
  })

  const { control, getValues } = formReturn
  const values = getValues()
  const assignedItemsArray = useFieldArray({
    control,
    name: 'assignedItems',
  })

  const downloadPdf = async () => {
    let doc = new jsPDF()
    doc = await createInvoicePdf({
      doc,
      workOrder,
      projectData,
      assignedItems: values.assignedItems ?? [],
      hideAward: true,
    })
    const pdfUri = doc.output('datauristring')
    downloadFile(pdfUri)
  }

  const parseAssignedItems = values => {
    const assignedItems = [
      ...values?.assignedItems?.map((a, index) => {
        if (a.document) {
          delete a?.document?.fileObject
        }
        const assignedItem = {
          ...a,
          orderNo: index,
          document: a.uploadedDoc ? a.uploadedDoc : a.document,
          location: a.location?.label,
        }
        delete assignedItem.uploadedDoc
        return assignedItem
      }),
    ]
    return {
      assignedItems: [...assignedItems],
    }
  }

  const onSubmit = values => {
    const updatedValues = parseAssignedItems(values)
    const { assignedItems } = values
    const hasMarkedSomeComplete = assignedItems?.some(item => item.isCompleted)

    if (displayAwardPlan && !workOrder?.awardPlanId && hasMarkedSomeComplete && tabIndex === 0) {
      setIsError(true)
      toast({
        title: 'Work Order',
        description: 'Award Plan is missing.',
        status: 'error',
        duration: 9000,
        isClosable: true,
        position: 'top-left',
      })
      return
    } else {
      setIsError(false)
    }
    setIsUpdating(true)
    updateWorkOrderDetails({ ...workOrder, ...updatedValues }, {
      onSettled: () => {
        setIsUpdating(false)
      },
    })
  }

  useEffect(() => {
    if (!documentsData?.length) return
    const uploadedWO = documentsData.find(
      doc => parseInt(doc.documentType, 10) === 16 && workOrder.id === doc.workOrderId,
    )
    setUploadedWO(uploadedWO)
  }, [documentsData])

  const checkKeyDown = e => {
    if (e.code === 'Enter') e.preventDefault()
  }
  const isSkillService = !!workOrder?.isServiceSkill
 

  useEffect(() => {
    if (!documentsData?.length) return
    const uploadedWO = documentsData.find(
      doc => parseInt(doc.documentType, 10) === 16 && workOrder.id === doc.workOrderId,
    )
    setUploadedWO(uploadedWO)
  }, [documentsData])

  return (
    <Box>
      <form onSubmit={formReturn.handleSubmit(onSubmit)} onKeyDown={e => checkKeyDown(e)}>
        <ModalBody h="600px" maxW="1100px" overflow={'auto'}>
          {[STATUS.Rejected].includes(workOrder?.statusLabel?.toLocaleLowerCase()) && !workOrder.lienWaiverAccepted && (
            <Alert m="25px" status="info" variant="custom" size="sm">
              <AlertIcon />
              <AlertDescription>{t(`${WORK_ORDER}.rejectedInvoiceInfo`)}</AlertDescription>
            </Alert>
          )}
          <SimpleGrid
            templateColumns={{ base: 'unset', sm: 'repeat(auto-fit , minmax(180px , 1fr))' }}
            spacing={'16px'}
            borderBottom="1px solid  #E2E8F0"
            minH="60px"
            my="30px"
            mx={{ base: '0', lg: '17px' }}
            mb="20px"
            alignItems={'left'}
            flexWrap="wrap"
            display={{ base: 'flex', sm: 'grid' }}
          >
            <Box flex={{ base: '1.1', sm: 'unset' }}>
              <SummaryCard
                title={t('WOIssued')}
                icon={BiCalendar}
                value={workOrder.workOrderIssueDate ? dateFormatNew(workOrder.workOrderIssueDate) : 'mm/dd/yy'}
              />
            </Box>
            <Box flex={{ base: '1', sm: 'unset' }}>
              <SummaryCard
                title={t('expectedStart')}
                icon={BiCalendar}
                value={workOrder.workOrderStartDate ? dateFormatNew(workOrder.workOrderStartDate) : 'mm/dd/yy'}
              />
            </Box>
            <Box flex={{ base: '1', sm: 'unset' }}>
              <SummaryCard
                icon={BiCalendar}
                title={t('expectedCompletion')}
                value={
                  workOrder.workOrderExpectedCompletionDate
                    ? dateFormatNew(workOrder.workOrderExpectedCompletionDate)
                    : 'mm/dd/yy'
                }
              />
            </Box>

            <Box flex={{ base: '1', sm: 'unset' }}>
              <SummaryCard
                icon={BiCalendar}
                title={t('completedByVendor')}
                value={workOrder.workOrderDateCompleted ? dateFormatNew(workOrder.workOrderDateCompleted) : 'mm/dd/yy'}
              />
            </Box>
            <Box flex={{ base: '1', sm: 'unset' }}>
              <SummaryCard
                title={t(`${NEW_PROJECT}.lockBoxCode`)}
                icon={BiFile}
                value={!!projectData?.lockBoxCode ? projectData?.lockBoxCode : '--'}
              />
            </Box>
          </SimpleGrid>
          <Box mx={{ base: '0', lg: '30px' }} mt={8}>
            {isLoadingLineItems ? (
              <Center>
                <Spinner size="lg" />
              </Center>
            ) : (
              <>
                {values?.assignedItems && values?.assignedItems?.length > 0 && (
                  <AssignedItems
                    isLoadingLineItems={isFetchingLineItems}
                    formControl={formReturn as UseFormReturn<any>}
                    assignedItemsArray={assignedItemsArray}
                    isAssignmentAllowed={false}
                    downloadPdf={downloadPdf}
                    workOrder={workOrder}
                    documentsData={documentsData}
                    isServiceSkill={isSkillService}
                  />
                )}
              </>
            )}
          </Box>
        </ModalBody>
        <ModalFooter borderTop="1px solid #CBD5E0" p={5}>
          <HStack justifyContent="start" w="100%">
            {uploadedWO && uploadedWO?.s3Url && (
              <Button
                variant="outline"
                colorScheme="brand"
                size="md"
                onClick={() => downloadFile(uploadedWO?.s3Url)}
                leftIcon={<BiDownload />}
              >
                {t('see')} {t('workOrder')}
              </Button>
            )}
          </HStack>
          <HStack spacing="16px" w="100%" justifyContent="end">
            <Button variant="outline" colorScheme="darkPrimary" onClick={onClose}>
              {t('cancel')}
            </Button>
            {values?.assignedItems && values?.assignedItems?.length > 0 && (
              <Button type="submit" colorScheme="darkPrimary" disabled={isUpdating || isFetchingLineItems}>
                {t('save')}
              </Button>
            )}
          </HStack>
        </ModalFooter>
      </form>
    </Box>
  )
}

export default WorkOrderDetailTab
