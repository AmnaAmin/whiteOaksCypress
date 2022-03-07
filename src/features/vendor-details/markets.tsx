import React, { useEffect } from "react";
import { Box, Button, Flex, useToast } from "@chakra-ui/react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import {
  VendorMarketFormValues,
  VendorProfile,
  VendorProfilePayload,
} from "types/vendor.types";
import {
  parseMarketAPIDataToFormValues,
  parseMarketFormValuesToAPIPayload,
  useMarkets,
  useVendorProfileUpdateMutation,
} from "utils/vendor-details";
import { CheckboxButton } from "components/form/checkbox-button";
import { useTranslation } from "react-i18next";
// import 'components/translation/i18n';

export const MarketList: React.FC<{ vendorProfileData: VendorProfile }> = ({
  vendorProfileData,
}) => {
  const { t } = useTranslation();
  const toast = useToast();
  const { markets } = useMarkets();
  const { mutate: updateVendorProfile } = useVendorProfileUpdateMutation();
  const {
    register,
    handleSubmit,
    control,
    reset,
    // formState: { errors }
  } = useForm<VendorMarketFormValues>({
    defaultValues: {
      markets: [],
    },
  });

  const { fields: tradeCheckboxes } = useFieldArray({
    control,
    name: "markets",
  });

  useEffect(() => {
    if (markets?.length && vendorProfileData) {
      const tradeFormValues = parseMarketAPIDataToFormValues(
        markets,
        vendorProfileData
      );

      reset(tradeFormValues);
    }
  }, [markets, vendorProfileData, reset]);

  const onSubmit = (formValues: VendorMarketFormValues) => {
    const vendorProfilePayload: VendorProfilePayload = parseMarketFormValuesToAPIPayload(
      formValues,
      vendorProfileData
    );

    updateVendorProfile(vendorProfilePayload, {
      onSuccess() {
        toast({
          title: "Update Vendor Profile Markets",
          description: "Vendor profile markets has been saved successfully.",
          status: "success",
          isClosable: true,
          position: "top-left",
        });
      },
    });
  };

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box h="65vh">
          <Flex maxW="800px" wrap="wrap" gridGap={3} pl={4}>
            {tradeCheckboxes.map((checkbox, index) => {
              return (
                <Controller
                  name={`markets.${index}`}
                  control={control}
                  key={checkbox.id}
                  render={({ field: { name, onChange, value } }) => {
                    return (
                      <CheckboxButton
                        name={name}
                        key={name}
                        isChecked={value.checked}
                        onChange={(event) => {
                          const checked = event.target.checked;
                          onChange({ ...checkbox, checked });
                        }}
                      >
                        {value.metropolitanServiceArea}
                      </CheckboxButton>
                    );
                  }}
                />
              );
            })}
          </Flex>
        </Box>
        <Flex
          borderTop="1px solid #E2E8F0"
          textAlign="end"
          pt="20px"
          pr="5%"
          w="100%"
          h="130px"
          mt="20px"
          justifyContent="end"
        >
          <Button type="submit" colorScheme="button">
            {t("save")}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
