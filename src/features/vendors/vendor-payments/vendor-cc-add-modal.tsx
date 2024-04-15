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
import { useForm } from 'react-hook-form'
import VendorCCForm from './vendor-cc-form'
import { useStripe, useElements, CardNumberElement } from '@stripe/react-stripe-js';
import { mapCCFormValuesToPayload, useCreateNewCreditCard, getIsPaymentServiceEnabled } from 'api/payment';
import { VendorProfile } from 'types/vendor.types'
import { PAYMENT_MANAGEMENT } from 'features/user-management/payment-management.i8n';
import { useStates } from 'api/pc-projects';

export interface CreditCardFormValues {
    billingAddress: {
        line1: string;
        city: string;
        postalCode: string;
        state: { label: string; value: string; type: string };
    }
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    isPaymentMethodDefault?: boolean;
}

const VendorCCAddModal: React.FC<{
    isOpen: boolean
    onClose: () => void
    vendorProfileData: VendorProfile
}> = ({ isOpen, onClose, vendorProfileData }) => {
    const isPaymentServiceEnabled = getIsPaymentServiceEnabled();
    const stripe = useStripe();
    const elements = useElements();
    const { stateSelectOptions } = useStates();

    const { mutate: createCreditCard, isLoading: isCreateCreditCardLoading } = useCreateNewCreditCard(vendorProfileData?.id);

    const formReturn = useForm<CreditCardFormValues>();

    const {
        handleSubmit,
        reset,
    } = formReturn;

    const onSubmit = async (values: CreditCardFormValues) => {
        if (!stripe || !elements) {
            console.error("Either stripe is null or element is null");
            return;
        }
        const cardElement = elements.getElement(CardNumberElement)!;
        const stripeTokenData = await stripe.createToken(cardElement);
        if (stripeTokenData?.error) {
            console.error("Error creating stripe token", stripeTokenData.error);
            return;
        }
        const payload = mapCCFormValuesToPayload(values, stripeTokenData, vendorProfileData, false);
        if (isPaymentServiceEnabled) createCreditCard(payload, {
            onSuccess: () => {
                onClose();
                reset();
            }
        });
    }


    return (
        <Modal
            isOpen={isOpen}
            onClose={() => {
                reset();
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
                        {t(`${PAYMENT_MANAGEMENT}.modal.newCreditCard`)}
                    </ModalHeader>
                    <ModalCloseButton _hover={{ bg: 'blue.50' }} />
                    <ModalBody justifyContent="center">
                        <Box>
                            <VendorCCForm formReturn={formReturn} stateSelectOptions={stateSelectOptions} />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Flex flexFlow="row-reverse" w="full">
                            <Button
                                size="md"
                                type="submit"
                                isLoading={isCreateCreditCardLoading}
                                onClick={handleSubmit(onSubmit)}
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
                                reset();
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

export default VendorCCAddModal
