import { Box, HStack, Text, Flex, SimpleGrid, Button, Checkbox } from '@chakra-ui/react'
import React from 'react'

import { BiCalendar, BiCheck, BiDownload, BiUpload } from 'react-icons/bi'
import { useTranslation } from 'react-i18next'

type WODates = {
  workOrderIssueDate: string
  workOrderCompletionDateVariance: string
  workOrderStartDate: string
  workOrderExpectedCompletionDate: string
  woStatus: { value: string; id: string }
}

const CalenderCard = props => {
  return (
    <Flex borderBottom="1px solid  #E2E8F0" pt={6} pb={8}>
      <Box pr={4}>
        <BiCalendar size={20} color="#718096" />
      </Box>
      <Box lineHeight="24px">
        <Text fontWeight={700} fontSize={16}>
          {props.title}
        </Text>
        <Text color="#718096" fontSize={14}>
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const TableBodyChilde: React.FC<{
  ProductName: string
  Details: string
  Quantity: string
  Price: string
  Status: string
  Images: string
  SKU: string
  disabled: boolean
}> = ({ ProductName, Details, Quantity, Price, Status, Images, SKU, disabled }) => {
  return (
    <SimpleGrid
      columns={7}
      // gap={10}
      spacing={5}
      p={3}
      pl={8}
      h="72px"
      borderBottom="1px solid #E2E8F0"
      alignItems="center"
      fontWeight={400}
      fontSize={14}
    >
      <Text>{SKU}</Text>
      <Text>{ProductName}</Text>
      <Text>{Details}</Text>
      <Text>{Quantity}</Text>
      <Text minW="60px">{Price}</Text>
      <Box>
        <Checkbox
          isDisabled={disabled}
          colorScheme="none"
          iconColor="green.400"
          h="32px"
          w="145px"
          m={0}
          color="green.400"
          bg="green.50"
          boxShadow="0px 0px 4px -2px "
          justifyContent="center"
          fontSize={14}
          fontWeight={600}
        >
          {Status}
        </Checkbox>
      </Box>

      <Box color="#4E87F8" overflow="hidden">
        <Button _focus={{ outline: 'none' }} variant="unstyled" leftIcon={<BiUpload />} textDecorationLine="underline">
          {Images}
        </Button>
      </Box>
    </SimpleGrid>
  )
}

const WorkOrderDetailTab = ({ woDates }: { woDates: WODates }) => {
  const { t } = useTranslation()

  return (
    <Box>
      <SimpleGrid columns={5} spacing={8} mt="31px">
        <CalenderCard title="WO Issued" date="11/14/2021" />
        <CalenderCard title="Expected Start " date="11/14/2021" />
        <CalenderCard title="Expected Completion" date="11/14/2021" />
        <CalenderCard title=" Completed by Vendor​" date="11/14/2021" />
        <CalenderCard title=" Completion Variance" date="6 Days" />
      </SimpleGrid>

      <Box p={6}>
        <Flex justifyContent="space-between" pt={2} pb={8} alignItems="center">
          <Text fontSize={18} fontWeight={700}>
            Assigned Line Items
          </Text>

          <HStack>
            <Button leftIcon={<BiDownload />} mr={5} border="1px solid #4E87F8" color="#4E87F8" colorScheme="white">
              Download as PDF
            </Button>

            <Button leftIcon={<BiCheck />} border="1px solid #4E87F8" color="#4E87F8" colorScheme="white">
              Mark All Completed
            </Button>
          </HStack>
        </Flex>
        <Box border="1px solid #E2E8F0">
          <Box bg=" #F7FAFC" h="40px">
            <SimpleGrid columns={7} p={3} pl={8} gap={4} color="#718096" fontSize={12} fontWeight={700}>
              <Text>SKU</Text>
              <Text>ProductName</Text>
              <Text>Details</Text>
              <Text>Quantity</Text>
              <Text>Price</Text>
              <Text>Status</Text>
              <Text>Images</Text>
            </SimpleGrid>
          </Box>
          <Box h={367.5} overflow="scroll">
            <TableBodyChilde
              disabled={true}
              SKU="#8383"
              ProductName="Debrish Trash"
              Details="Remove Trash from Outdoor"
              Quantity="2"
              Price="$450"
              Status="Not Completed"
              Images="Upload"
            />

            <TableBodyChilde
              disabled={false}
              SKU="#8383"
              ProductName="Remove Satellite dish"
              Details="Remove all cables"
              Quantity="12"
              Price="$200"
              Status="Completed"
              Images="First23.img"
            />

            <TableBodyChilde
              disabled={false}
              SKU="#8383"
              ProductName="Install Blinders"
              Details="Replace Curtains"
              Quantity="15"
              Price="$1400"
              Status="Completed"
              Images="First88.img"
            />

            <TableBodyChilde
              disabled={true}
              SKU="#8383"
              ProductName="Wall Lock Box"
              Details="Home Depot Lock Box"
              Quantity="8"
              Price="$150"
              Status="Not Completed"
              Images="Tsk19.img"
            />

            <TableBodyChilde
              disabled={false}
              SKU="#8383"
              ProductName="Push Button"
              Details="Replace Buttons"
              Quantity="3"
              Price="$450"
              Status="Completed"
              Images="Upload"
            />
          </Box>
        </Box>
      </Box>

      <Flex pr={10} h="80px" justifyContent="end" borderTop="1px solid #CBD5E0" pt={5}>
        <Button variant="ghost" mr={3} size="lg">
          {t('close')}
        </Button>
        <Button colorScheme="CustomPrimaryColor" mr={3} size="lg">
          {t('save')}
        </Button>
      </Flex>
    </Box>
  )
}

export default WorkOrderDetailTab
