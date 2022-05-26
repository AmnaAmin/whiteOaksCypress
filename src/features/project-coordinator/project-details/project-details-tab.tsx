import { Box, Button, Divider, Icon, Stack } from '@chakra-ui/react'
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
          <Tab>Project Management</Tab>
          <Tab>Invoicing & payment</Tab>
          <Tab>Contacts</Tab>
          <Tab>Location</Tab>
          <Tab>Misc</Tab>
        </TabList>

        <TabPanels mt="31px">
          <TabPanel p="0" ml="2">
            <ProjectManagement />
          </TabPanel>

          <TabPanel p="0" ml="2">
            <InvoiceAndPayments />
          </TabPanel>

          <TabPanel p="0" ml="2">
            <Contact />
          </TabPanel>
          <TabPanel p="0" ml="2">
            <Location />
          </TabPanel>

          <TabPanel p="0" ml="2">
            <Misc />
          </TabPanel>
          {tabIndex === 0 && (
            <Stack>
              <Box mt="3">
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button
                  mt="8px"
                  mr="7"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  form="project"
                >
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
              <Box mt="3">
                <Divider border="1px solid" />
              </Box>

              <Box w="100%" pb="3">
                <Button
                  mt="8px"
                  mr="7"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  size="md"
                  form="invoice"
                >
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
                      size="md"
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
              <Box mt="3">
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button
                  mt="8px"
                  mr="7"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  form="contact"
                >
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
              <Box mt="3">
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button
                  mt="8px"
                  mr="7"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  form="location"
                >
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
              <Box mt="3">
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button mt="8px" mr="7" float={'right'} variant="solid" colorScheme="brand" type="submit" form="misc">
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
