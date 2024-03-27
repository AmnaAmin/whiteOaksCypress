import {
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Button,
    Flex,
    Box
} from '@chakra-ui/react'
import { t } from 'i18next'
import { VendorAccountsFormValues, VendorProfile } from 'types/vendor.types'
import { PAYMENT_MANAGEMENT } from 'features/user-management/payment-management.i8n';
import { useStates } from 'api/pc-projects';
import VendorACHForm from './vendor-ach-form';
import { useFormContext } from 'react-hook-form';

const VendorACHAddModal: React.FC<{
    isOpen: boolean
    onClose: () => void
    vendorProfileData: VendorProfile
    isActive
}> = ({ isOpen, onClose, vendorProfileData, isActive }) => {
    const { stateSelectOptions } = useStates();
    const formReturn = useFormContext<VendorAccountsFormValues>()


    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                onClose();
            }}
            size="flexible"
            variant="custom"
            closeOnOverlayClick={false}
        >
            <ModalOverlay />
            <form>
                <ModalContent w="900px" rounded="6px" borderTop="2px solid #4E87F8">
                    <ModalHeader
                        borderBottom="2px solid #E2E8F0"
                        fontWeight={500}
                        color="gray.600"
                        fontSize="16px"
                        fontStyle="normal"
                        mb="5"
                    >
                        {t(`${PAYMENT_MANAGEMENT}.modal.newAchForm`)}
                    </ModalHeader>
                    <ModalCloseButton _hover={{ bg: 'blue.50' }} />
                    <ModalBody justifyContent="center">
                        <Box>
                            <VendorACHForm vendorProfileData={vendorProfileData} formReturn={formReturn} isActive={isActive} stateSelectOptions={stateSelectOptions} />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Flex flexFlow="row-reverse" w="full">
                            <Button
                                size="md"
                                type="submit"
                                // isLoading={isCreateCreditCardLoading}
                                // onClick={handleSubmit(onSubmit)}
                                colorScheme="brand"
                                rounded="6px"
                                fontSize="14px"
                                data-testid="save"
                                fontWeight={500}
                                w="6px"
                                mr={3}>
                                {t(`${PAYMENT_MANAGEMENT}.modal.save`)}
                            </Button>
                            <Button colorScheme="brand" variant="outline" mr={3} data-testid="cancel" onClick={() => {
                                onClose();
                            }}>
                                {t(`${PAYMENT_MANAGEMENT}.modal.cancel`)}
                            </Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default VendorACHAddModal
