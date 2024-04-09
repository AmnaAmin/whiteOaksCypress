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
import { useEffect, useRef } from 'react';
import { BiDownload } from 'react-icons/bi';
import { VENDORPROFILE } from 'features/vendor-profile/vendor-profile.i18n';
import { convertImageToDataURL } from 'components/table/util';
import jsPDF from 'jspdf';
import { createACHForm } from 'api/vendor-details';
import { useRoleBasedPermissions } from 'utils/redux-common-selectors';

const VendorACHModal: React.FC<{
    isOpen: boolean
    onClose: () => void
    vendorProfileData: VendorProfile
    isActive
    isVendorAccountSaveLoading?: boolean
}> = ({ isOpen, onClose, vendorProfileData, isActive, isVendorAccountSaveLoading }) => {
    const { stateSelectOptions } = useStates();
    const sigRef = useRef<HTMLImageElement>(null);
    const formReturn = useFormContext<VendorAccountsFormValues>();
    const { formState, watch } = formReturn;
    const isSubmitting = formState.isSubmitting;
    const isSubmitted = formState.isSubmitted;
    const isSubmitSuccessful = formState.isSubmitSuccessful;
    const watchOwnersSignature = watch('ownersSignature')
    const hasOwnerSignature = !!watchOwnersSignature && !watchOwnersSignature?.fileObject && vendorProfileData // signature has saved s3url and not fileobject

    const isReadOnly = !useRoleBasedPermissions().permissions.some(e =>
        ['VENDOR.EDIT', 'VENDORPROFILE.EDIT', 'ALL'].includes(e),
    )

    const downloadACFForm = () => {
        let form = new jsPDF()
        const dimention = {
            width: sigRef?.current?.width,
            height: sigRef?.current?.height,
        }

        convertImageToDataURL(watchOwnersSignature, (dataUrl: string) => {
            createACHForm(form, { ...vendorProfileData }, dimention, dataUrl)
        })
    }

    useEffect(() => {
        if (!isSubmitting && isSubmitted && isSubmitSuccessful && !isVendorAccountSaveLoading) {
            onClose();
        }
    }, [isSubmitted, isSubmitting, isVendorAccountSaveLoading])

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
                            <VendorACHForm vendorProfileData={vendorProfileData} formReturn={formReturn} isActive={isActive} stateSelectOptions={stateSelectOptions} isReadOnly={isReadOnly} />
                        </Box>
                    </ModalBody>
                    <ModalFooter>
                        <Box w="full">
                            {hasOwnerSignature && (
                                <Button
                                    onClick={downloadACFForm}
                                    leftIcon={<BiDownload />}
                                    data-testid="downloadACHForm"
                                    variant="outline"
                                    colorScheme="brand"
                                >
                                    {t(`${VENDORPROFILE}.downloadACFForm`)}
                                </Button>
                            )}
                            <Flex w="full" justifyContent="flex-end">
                                <Flex flexFlow="row-reverse">
                                    {!isReadOnly && <Button
                                        type="submit"
                                        isLoading={Boolean(isSubmitting) || isVendorAccountSaveLoading}
                                        colorScheme="brand"
                                        data-testid="save-ach-form"
                                        mr={3}>
                                        {t(`${PAYMENT_MANAGEMENT}.modal.save`)}
                                    </Button>}
                                    <Button colorScheme="brand" variant="outline" mr={3} data-testid="cancel" onClick={() => {
                                        onClose();
                                    }}>
                                        {t(`${PAYMENT_MANAGEMENT}.modal.cancel`)}
                                    </Button>
                                </Flex>
                            </Flex>
                        </Box>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default VendorACHModal
