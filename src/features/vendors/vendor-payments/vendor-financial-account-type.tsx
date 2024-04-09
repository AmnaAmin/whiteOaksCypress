import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    Flex,
    useBreakpointValue,
    FormLabel,
    FormErrorMessage,
    FormControl
} from '@chakra-ui/react'
import { useState } from 'react';
import Select from 'components/form/react-select'
import { t } from 'i18next';
import { PAYMENT_MANAGEMENT } from 'features/user-management/payment-management.i8n';
import { StripePayment } from 'types/vendor.types'
import { isPaymentServiceEnabled } from 'api/payment';


interface VendorFinancialAccountTypeProps {
    isOpen: boolean
    isLoading?: boolean
    onClose: any
    onConfirm: (selectedValue: string | null) => void
    achPaymentMethod: StripePayment | undefined
}

export enum AccountType {
    CREDIT_CARD = "Credit Card",
    ACH_BANK = "ACH",
}

type AccountTypeDropdown = {
    label: string
    value: string
}

export function VendorFinancialAccountType({
    isOpen,
    isLoading = false,
    onClose,
    onConfirm,
    achPaymentMethod
}: VendorFinancialAccountTypeProps) {
    const modalSize = useBreakpointValue({
        base: 'xs',
        sm: 'lg',
    });

    /*
        HN|PSWOA-9944: During the time of development of this feature, this modal contains a single dropdown.
        Setting up react hook form looks like an overkill for a single dropdown.
        That is why I did things manually, in future if more fields are added, I recommend you to use react hook form.
    */
    const [selectedOption, setSelectedOption] = useState<AccountTypeDropdown | null>(null);
    const [error, setError] = useState<string>("");

    let accountTypeOption: AccountTypeDropdown[] | [] = [];

    if (!achPaymentMethod && isPaymentServiceEnabled) {
        accountTypeOption = [
            { label: "Credit Card", value: AccountType.CREDIT_CARD },
            { label: "ACH", value: AccountType.ACH_BANK }
        ];
    } else if (!isPaymentServiceEnabled && !achPaymentMethod) {
        accountTypeOption = [
            { label: "ACH", value: AccountType.ACH_BANK }
        ];
    }

    const onSelectOptionChange = (val) => {
        setSelectedOption(val);
        if (error?.length > 0) {
            setError("");
        }
    }

    const onSaveClick = () => {
        if (!selectedOption) {
            return setError("Please select an account type to proceed.")
        } else if (error?.length) {
            setError("")
        }
        onConfirm(selectedOption?.value ?? null)
        setSelectedOption(null);
    };

    const onCloseClick = () => {
        setError("");
        setSelectedOption(null);
        onClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            isCentered={true}
            closeOnEsc={false}
            closeOnOverlayClick={false}
            size={modalSize}
        >
            <ModalOverlay />
            <ModalContent rounded={3} borderTop="3px solid #345EA6">
                <ModalHeader
                    borderBottom="2px solid #E2E8F0"
                    fontWeight={500}
                    color="gray.600"
                    fontSize="16px"
                    fontStyle="normal"
                    mb="5"
                >
                    {t(`${PAYMENT_MANAGEMENT}.modal.selectAnOptionToContinue`)}
                </ModalHeader>
                <ModalCloseButton _focus={{ border: 'none' }} _hover={{ bg: 'blue.50' }} color="#4A5568" />

                <ModalBody>
                    <FormControl isInvalid={error?.length > 0}>
                        <FormLabel fontSize="14px" fontWeight={500} color="gray.600">
                            Account Type
                        </FormLabel>
                        <div data-testid="account-type">
                            <Select
                                options={accountTypeOption}
                                classNamePrefix="account_type"
                                size="md"
                                id="account_type"
                                value={selectedOption}
                                onChange={onSelectOptionChange}
                            />
                        </div>
                        <FormErrorMessage>{error}</FormErrorMessage>
                    </FormControl>
                </ModalBody>
                <Flex flexFlow="row-reverse" borderTop="2px solid #E2E8F0">
                    <ModalFooter>
                        <Button colorScheme="brand" mr={3} data-testid="vendor-finance-account-cancel" variant="outline" onClick={onCloseClick}>
                            {t(`${PAYMENT_MANAGEMENT}.modal.cancel`)}
                        </Button>
                        <Button
                            onClick={onSaveClick}
                            isLoading={isLoading}
                            colorScheme="brand"
                            data-testid="vendor-finance-account-save"
                        >
                            {t(`${PAYMENT_MANAGEMENT}.modal.save`)}
                        </Button>
                    </ModalFooter>
                </Flex>
            </ModalContent>
        </Modal>
    )
}

