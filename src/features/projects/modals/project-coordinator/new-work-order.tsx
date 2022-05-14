import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import ReactSelect from 'components/form/react-select'
import React from 'react'
import { BiCalendar } from 'react-icons/bi'
import { ProjectType } from 'types/project.type'
import { dateFormatter } from 'utils/new-work-order'
import { currencyFormatter } from 'utils/stringFormatters'
import { documentTypes } from 'utils/vendor-projects'

const CalenderCard = props => {
  return (
    <Flex>
      <Box pr={4}>
        <BiCalendar size={23} color="#718096" />
      </Box>
      <Box lineHeight="20px">
        <Text whiteSpace="nowrap" fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text whiteSpace="nowrap" color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const InformationCard = props => {
  return (
    <Flex>
      <Box lineHeight="20px">
        <Text whiteSpace="nowrap" fontWeight={500} fontSize="14px" fontStyle="normal" color="gray.600" mb="1">
          {props.title}
        </Text>
        <Text whiteSpace="nowrap" color="gray.500" fontSize="14px" fontStyle="normal" fontWeight={400}>
          {props.date}
        </Text>
      </Box>
    </Flex>
  )
}

const NewWorkOrder: React.FC<{
  projectData: ProjectType
  isOpen: boolean
  onClose: () => void
}> = ({ projectData, isOpen, onClose }) => {
  return (
    <div>
      <Modal size="none" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w="1137px" rounded={3} borderTop="2px solid #4E87F8">
          <ModalHeader h="63px" borderBottom="1px solid #CBD5E0" color="gray.600" fontSize={16} fontWeight={500}>
            New Work Order
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody justifyContent="center">
            <Box>
              <SimpleGrid columns={6} spacing={1} borderBottom="1px solid  #E2E8F0" minH="110px" alignItems={'center'}>
                <CalenderCard title="Client Start" date={dateFormatter(projectData?.clientStartDate)} />
                <CalenderCard title="Client End " date={dateFormatter(projectData?.clientDueDate)} />
                <InformationCard title="Profit Percentage" date={`${projectData?.profitPercentage}%`} />
                <InformationCard title=" Final SOW Amount" date={currencyFormatter(projectData?.revenue)} />
                <InformationCard title=" Email" date={projectData?.createdBy} />
                <InformationCard title=" Phone No" date={projectData?.hoaPhone} />
              </SimpleGrid>
              <Box mt={10}>
                <SimpleGrid w="85%" columns={4} spacingX={6} spacingY={12}>
                  <Box>
                    <FormControl height="40px">
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        Type
                      </FormLabel>
                      <ReactSelect selectProps={{ isLeftBorder: true }} options={documentTypes} />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl>
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        Company Name
                      </FormLabel>
                      <ReactSelect selectProps={{ isLeftBorder: true }} options={documentTypes} />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl>
                      <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                        Client Approved Ammount
                      </FormLabel>
                      <Input placeholder="$0.00" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl>
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        Profit Percentage
                      </FormLabel>
                      <Input placeholder="0%" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
                    </FormControl>
                  </Box>

                  <Box height="80px">
                    <FormControl>
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        Vendor WO Ammount
                      </FormLabel>
                      <Input placeholder="$0.00" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl>
                      <FormLabel whiteSpace="nowrap" fontSize="14px" fontWeight={500} color="gray.600">
                        Expected Start Date
                      </FormLabel>
                      <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
                    </FormControl>
                  </Box>
                  <Box>
                    <FormControl>
                      <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                        Expected Compiltion Date
                      </FormLabel>
                      <Input type="date" height="40px" borderLeft="2px solid #4E87F8" focusBorderColor="none" />
                    </FormControl>
                  </Box>
                </SimpleGrid>
              </Box>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" size="lg" variant="outline" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" size="lg" isDisabled={true}>
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}

export default NewWorkOrder
