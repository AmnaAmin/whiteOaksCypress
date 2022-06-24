import { Modal, ModalContent, ModalHeader, ModalBody, Button, GridItem, Grid, Box, Divider } from '@chakra-ui/react'
import FailedIcon from 'icons/failed-icon'
interface VerifyAddressBoxProps {
  isOpen: boolean
  isLoading?: boolean
  onClose: () => void
  save: () => void
  title: string
  content: string
  props: string
  isDuplicateAddress: boolean
}

export function ModalDuplicateAddress({
  isOpen,
  isLoading = false,
  onClose,
  // onConfirm,
  title,
  content,
  props,
  isDuplicateAddress,
}: VerifyAddressBoxProps) {
  // const [closeModal, setCloseModal] = useState(isOpen)
  // const [continueUnverified, setContinueUnverified] = useState(false)
  // const toggleSubModal = () => props

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered={false}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      size="4xl"
    >
      <ModalContent rounded="6" top={75}>
        <Grid height={85} templateRows="repeat(2, 1fr)" templateColumns="repeat(5, 1fr)">
          <GridItem rowSpan={2} colSpan={1} bg="#4E87F8" roundedLeft={6} alignItems={'center'} height={85}>
            <Box position={'absolute'} left={58} top={6}>
              <FailedIcon />
            </Box>
          </GridItem>
          <GridItem colSpan={3}>
            <ModalHeader fontWeight={500} color="gray.600" fontSize="18px" fontStyle="normal" mb="-4">
              {title}
            </ModalHeader>
            <ModalBody>
              <Box className="uspsAdressVerification" marginTop={-2} color={'red'}>
                <h5>Project ID xxx using this address already exist & is in xxx state</h5>
              </Box>
            </ModalBody>
          </GridItem>
          <GridItem rowSpan={1} colSpan={1} height={85} borderLeft="1px solid #E9EDF3">
            <>
              <GridItem colSpan={2}>
                <Box>
                  <Button
                    bg="none"
                    color="#4E87F8"
                    _hover={{ bg: 'none' }}
                    _focus={{ border: '1px solid #4E87F8' }}
                    fontSize="14px"
                    fontStyle="normal"
                    fontWeight={500}
                    width={180}
                    height={45}
                  >
                    Continue
                  </Button>
                </Box>
              </GridItem>
              <Divider orientation="horizontal" />
              <GridItem colSpan={2}>
                <Box>
                  <Button
                    bg="none"
                    color="black"
                    _hover={{ bg: 'none' }}
                    _focus={{ border: '1px solid #4E87F8' }}
                    fontSize="14px"
                    fontStyle="normal"
                    fontWeight={500}
                    width={180}
                    height={45}
                  >
                    Cancel
                  </Button>
                </Box>
              </GridItem>
            </>
            {/* </ModalFooter> */}
          </GridItem>
        </Grid>
      </ModalContent>
    </Modal>
  )
}
