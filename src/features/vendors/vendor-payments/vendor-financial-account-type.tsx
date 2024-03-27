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


interface VendorFinancialAccountTypeProps {
    isOpen: boolean
    isLoading?: boolean
    onClose: any
    onConfirm: (selectedValue: AccountType | null) => void
}

export enum AccountType {
    CREDIT_CARD = 1,
    ACH_BANK = 2,
}

type AccountTypeDropdown = {
    label: string
    value: number
}

export function VendorFinancialAccountType({
    isOpen,
    isLoading = false,
    onClose,
    onConfirm
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

    const accountTypeOption: AccountTypeDropdown[] = [
        { label: "Credit Card", value: AccountType.CREDIT_CARD },
        { label: "ACH", value: AccountType.ACH_BANK }
    ];

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
                            size="md"
                            onClick={onSaveClick}
                            isLoading={isLoading}
                            colorScheme="brand"
                            rounded="6px"
                            fontSize="14px"
                            data-testid="vendor-finance-account-save"
                            fontWeight={500}
                            w="6px"
                        >
                            {t(`${PAYMENT_MANAGEMENT}.modal.save`)}
                        </Button>
                    </ModalFooter>
                </Flex>
            </ModalContent>
        </Modal>
    )
}

