import { Box, Button, Divider, HStack, Icon, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Location from './location'
import Contact from './contact'
import ProjectManagement from './project-management'
import Misc from './misc'
import InvoiceAndPayments from './invoice-and-payments'
import { BiSpreadsheet } from 'react-icons/bi'

const ProjectDetailsTab: React.FC<{ id?: string; onClose?: () => void }> = props => {
  const [tabIndex, setTabIndex] = useState<number>(0)

  return (
    <>
      <Tabs
        variant={props.id === 'Receivable' ? 'enclosed' : 'line'}
        colorScheme="brand"
        onChange={index => setTabIndex(index)}
      >
        <TabList bg={props.id === 'Receivable' ? '' : '#F7FAFC'} rounded="6px 6px 0 0" pt="7">
          <HStack spacing={5}>
            <Tab>Project Management</Tab>
            <Tab>Invoicing & payment</Tab>
            <Tab>Contacts</Tab>
            <Tab>Location</Tab>
            <Tab>Misc</Tab>
          </HStack>
        </TabList>

        <TabPanels>
          <TabPanel mt="12" p="0" ml="6">
            <ProjectManagement />
          </TabPanel>

          <TabPanel mt="12" p="0" ml="6">
            <InvoiceAndPayments />
          </TabPanel>

          <TabPanel mt="12" p="0" ml="6">
            <Contact />
          </TabPanel>
          <TabPanel mt="12" p="0" ml="6">
            <Location />
          </TabPanel>

          <TabPanel mt="12" p="0" ml="6">
            <Misc />
          </TabPanel>
          {tabIndex === 0 && (
            <Stack>
              <Box>
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button mt="8px" mr="7" float={'right'} variant="solid" colorScheme="brand" type="submit">
                  Save
                </Button>
                {props.onClose && (
                  <>
                    <Button
                      onClick={props.onClose}
                      mt="8px"
                      mr="5"
                      float={'right'}
                      variant="outline"
                      colorScheme="brand"
                    >
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      variant="outline"
                      colorScheme="brand"
                      leftIcon={<Icon boxSize={6} as={BiSpreadsheet} mb="0.5" />}
                    >
                      See Project Details
                    </Button>
                  </>
                )}
              </Box>
            </Stack>
          )}
          {tabIndex === 1 && (
            <Stack>
              <Box>
                <Divider border="1px solid" />
              </Box>

              <Box w="100%" pb="3">
                <Button mt="8px" mr="7" float={'right'} variant="solid" colorScheme="brand" type="submit">
                  Save
                </Button>
                {props.onClose && (
                  <>
                    <Button
                      onClick={props.onClose}
                      mt="8px"
                      mr="5"
                      float={'right'}
                      variant="outline"
                      colorScheme="brand"
                    >
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      variant="outline"
                      colorScheme="brand"
                      leftIcon={<Icon boxSize={6} as={BiSpreadsheet} mb="0.5" />}
                    >
                      See Project Details
                    </Button>
                  </>
                )}
              </Box>
            </Stack>
          )}
          {tabIndex === 2 && (
            <Stack>
              <Box>
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button mt="8px" mr="7" float={'right'} variant="solid" colorScheme="brand" type="submit">
                  Save
                </Button>
                {props.onClose && (
                  <>
                    <Button
                      onClick={props.onClose}
                      mt="8px"
                      mr="5"
                      float={'right'}
                      variant="outline"
                      colorScheme="brand"
                    >
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      variant="outline"
                      colorScheme="brand"
                      leftIcon={<Icon boxSize={6} as={BiSpreadsheet} mb="0.5" />}
                    >
                      See Project Details
                    </Button>
                  </>
                )}
              </Box>
            </Stack>
          )}
          {tabIndex === 3 && (
            <Stack>
              <Box>
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button mt="8px" mr="7" float={'right'} variant="solid" colorScheme="brand" type="submit">
                  Save
                </Button>
                {props.onClose && (
                  <>
                    <Button
                      onClick={props.onClose}
                      mt="8px"
                      mr="5"
                      float={'right'}
                      variant="outline"
                      colorScheme="brand"
                    >
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      variant="outline"
                      colorScheme="brand"
                      leftIcon={<Icon boxSize={6} as={BiSpreadsheet} mb="0.5" />}
                    >
                      See Project Details
                    </Button>
                  </>
                )}
              </Box>
            </Stack>
          )}
          {tabIndex === 4 && (
            <Stack>
              <Box>
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button mt="8px" mr="7" float={'right'} variant="solid" colorScheme="brand" type="submit">
                  Save
                </Button>
                {props.onClose && (
                  <>
                    <Button
                      onClick={props.onClose}
                      mt="8px"
                      mr="5"
                      float={'right'}
                      variant="outline"
                      colorScheme="brand"
                    >
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      variant="outline"
                      colorScheme="brand"
                      leftIcon={<Icon boxSize={6} as={BiSpreadsheet} mb="0.5" />}
                    >
                      See Project Details
                    </Button>
                  </>
                )}
              </Box>
            </Stack>
          )}
        </TabPanels>
      </Tabs>
    </>
  )
}

export default ProjectDetailsTab
