import { FormControl, FormErrorMessage, HStack, Radio, RadioGroup, Stack } from "@chakra-ui/react"
import { useEffect, useState } from "react"
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
        setValue,
        formState: { errors },
    } = formReturn;

    const onRadioBtnChange = (value: string) => {
        setSelectedBtn(value);
        setValue("isSubscriptionOn", value === "on" ? true : false);
    }

    useEffect(() => {
        if (vendorProfileData?.isSubscriptionOn) {
            setSelectedBtn("on")
        } else {
            setSelectedBtn("off")
        }
    }, [vendorProfileData?.isSubscriptionOn])

    return (<>
        <HStack spacing="16px">
            <RadioGroup w="100%" justifyContent={'flex-start'} defaultValue={selectedBtn} value={selectedBtn} onChange={onRadioBtnChange} isDisabled={!enableSubscriptionField}>
                <Stack direction="row">
                    <Radio value={"on"} pr={4}>ON</Radio>
                    <Radio value={"off"}>OFF</Radio>
                </Stack>
            </RadioGroup>
        </HStack>
        <FormErrorMessage pos="absolute">{errors.isSubscriptionOn?.message}</FormErrorMessage>
    </>)
}

export default SubscriptionRadioGroup
