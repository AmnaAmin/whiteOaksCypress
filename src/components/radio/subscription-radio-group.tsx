import { FormControl, FormErrorMessage, HStack, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"
import { VendorAccountsFormValues, VendorProfile } from "types/vendor.types"

type SubscriptionRadioGroupProps = {
    vendorProfileData: VendorProfile
    formReturn: UseFormReturn<VendorAccountsFormValues, any>
    enableSubscriptionField: boolean
}

const SubscriptionRadioGroup = ({ vendorProfileData, formReturn, enableSubscriptionField }: SubscriptionRadioGroupProps) => {
    const [selectedBtn, setSelectedBtn] = useState<string>(vendorProfileData?.isSubscriptionOn ? "on" : "off");
    const {
        register,
        formState: { errors },
    } = formReturn;

    const onRadioBtnChange = (value: string) => {
        setSelectedBtn(value);
    }

    return (<FormControl>
        <HStack spacing="16px">
            <RadioGroup w="100%" justifyContent={'flex-start'} defaultValue={selectedBtn} value={selectedBtn} onChange={onRadioBtnChange} isDisabled={!enableSubscriptionField}>
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
