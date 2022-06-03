import { Box, Button, Divider, Icon, Stack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import Location from './location'
import Contact from './contact'
import ProjectManagement from './project-management'
import Misc from './misc'
import InvoiceAndPayments from './invoice-and-payments'
import { BiSpreadsheet } from 'react-icons/bi'

type tabProps = {
  onClose?: () => void
  marginX?: { marginLeft: string; marginRight: string }
  backGround?: { backgroundColor: string }
  tabVariant?: string
  height?: { height: string }
}

const ProjectDetailsTab = (props: tabProps) => {
  const { marginX, onClose, backGround, tabVariant, height } = props
  const [tabIndex, setTabIndex] = useState<number>(0)

  return (
    <>
      <Tabs variant={tabVariant || 'line'} colorScheme="brand" onChange={index => setTabIndex(index)}>
        <TabList
          bg={backGround?.backgroundColor ? '' : '#F7FAFC'}
          rounded="6px 6px 0 0"
          pt="7"
          ml={marginX?.marginLeft || ''}
          mr={marginX?.marginRight || ''}
          {...marginX}
        >
          <Tab>Project Management</Tab>
          <Tab>Invoicing & payment</Tab>
          <Tab>Contacts</Tab>
          <Tab>Location</Tab>
          <Tab>Misc</Tab>
        </TabList>

        <TabPanels mt="31px">
          <TabPanel p="0" ml="32px">
            <ProjectManagement height={height} />
          </TabPanel>

          <TabPanel p="0" ml="32px">
            <InvoiceAndPayments height={height} />
          </TabPanel>

          <TabPanel p="0" ml="32px">
            <Contact height={height} />
          </TabPanel>
          <TabPanel p="0" ml="32px">
            <Location height={height} />
          </TabPanel>

          <TabPanel p="0" ml="32px">
            <Misc height={height} />
          </TabPanel>
          {tabIndex === 0 && (
            <Stack>
              <Box mt="3">
                <Divider border="1px solid" />
              </Box>
              <Box w="100%" pb="3">
                <Button
                  mt="8px"
                  mr="32px"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  form="project"
                >
                  Save
                </Button>
                {onClose && (
                  <>
                    <Button onClick={onClose} mt="8px" mr="5" float={'right'} variant="outline" colorScheme="brand">
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      ml="32px"
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
                  mr="32px"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  size="md"
                  form="invoice"
                >
                  Save
                </Button>
                {onClose && (
                  <>
                    <Button
                      onClick={onClose}
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
                      ml="32px"
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
                  mr="32px"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  form="contact"
                >
                  Save
                </Button>
                {onClose && (
                  <>
                    <Button onClick={onClose} mt="8px" mr="5" float={'right'} variant="outline" colorScheme="brand">
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      ml="32px"
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
                  mr="32px"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  form="location"
                >
                  Save
                </Button>
                {onClose && (
                  <>
                    <Button onClick={onClose} mt="8px" mr="5" float={'right'} variant="outline" colorScheme="brand">
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      ml="32px"
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
                <Button
                  mt="8px"
                  mr="32px"
                  float={'right'}
                  variant="solid"
                  colorScheme="brand"
                  type="submit"
                  form="misc"
                >
                  Save
                </Button>
                {onClose && (
                  <>
                    <Button onClick={onClose} mt="8px" mr="5" float={'right'} variant="outline" colorScheme="brand">
                      Cancel
                    </Button>
                    <Button
                      mt="8px"
                      ml="32px"
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
