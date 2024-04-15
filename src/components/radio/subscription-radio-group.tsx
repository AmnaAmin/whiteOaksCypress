import { FormControl, FormErrorMessage, HStack, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import { useCallback } from "react"
import { UseFormReturn } from "react-hook-form"
import { VendorAccountsFormValues, VendorProfile } from "types/vendor.types"

type SubscriptionRadioGroupProps = {
    vendorProfileData: VendorProfile
    formReturn: UseFormReturn<VendorAccountsFormValues, any>
    enableSubscriptionField: boolean
}

const SubscriptionRadioGroup = ({ vendorProfileData, formReturn, enableSubscriptionField }: SubscriptionRadioGroupProps) => {
    const {
        register,
        formState: { errors },
    } = formReturn;

    const defaultValue: () => string = useCallback(() => {
        return (vendorProfileData?.isSubscriptionOn ? "on" : "off");
    }, [vendorProfileData?.isSubscriptionOn])


    return (<FormControl>
        <HStack spacing="16px">
            <RadioGroup w="100%" justifyContent={'flex-start'} defaultValue={defaultValue()} isDisabled={!enableSubscriptionField}>
                <Stack direction="row">
                    <FormControl>
                        <Radio {...register("isSubscriptionOn")} value={"on"} pr={4}>ON</Radio>
                        <Radio {...register("isSubscriptionOn")} value={"off"}>OFF</Radio>
                    </FormControl>
                </Stack>
            </RadioGroup>
        </HStack>
        <FormErrorMessage pos="absolute">{errors.isSubscriptionOn?.message}</FormErrorMessage>
    </FormControl>)
}

export default SubscriptionRadioGroup
