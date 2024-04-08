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
import { mapCCFormValuesToPayload, mapCCToFormValues, useUpdateCredtCard } from 'api/payment';
import { StripePayment, VendorProfile } from 'types/vendor.types'
import { PAYMENT_MANAGEMENT } from 'features/user-management/payment-management.i8n';
import { useStates } from 'api/pc-projects';
import { CreditCardFormValues } from './vendor-cc-add-modal';


const VendorCCUpdateModal: React.FC<{
    isOpen: boolean
    onClose: () => void
    vendorProfileData: VendorProfile
    creditCardData: StripePayment
}> = ({ isOpen, onClose, vendorProfileData, creditCardData }) => {
    const stripe = useStripe();
    const elements = useElements();
    const { stateSelectOptions } = useStates();

    const { mutate: updateCreditCard, isLoading: isUpdateCreditCardLoading } = useUpdateCredtCard(vendorProfileData?.id, creditCardData.id);
    const initialValues = mapCCToFormValues(creditCardData, stateSelectOptions)

    const formReturn = useForm<CreditCardFormValues>({
        defaultValues: initialValues ?? {}
    })

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
        const payload = mapCCFormValuesToPayload(values, stripeTokenData, vendorProfileData, true);
        updateCreditCard(payload, {
            onSuccess: () => {
                onClose();
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
                        {t(`${PAYMENT_MANAGEMENT}.modal.updateCreditCard`)}
                    </ModalHeader>
                    <ModalCloseButton _hover={{ bg: 'blue.50' }} />
                    <ModalBody justifyContent="center">
                        <Box>
                            <VendorCCForm formReturn={formReturn} stateSelectOptions={stateSelectOptions} isUpdate={!!vendorProfileData} />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Flex flexFlow="row-reverse" w="full">
                            <Button
                                type="submit"
                                isLoading={isUpdateCreditCardLoading}
                                onClick={handleSubmit(onSubmit)}
                                colorScheme="brand"
                                data-testid="update"
                                mr={3}>
                                {t(`${PAYMENT_MANAGEMENT}.modal.update`)}
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

export default VendorCCUpdateModal
