import React, { useCallback, useEffect } from "react";
import {
  Box,
  Flex,
  VStack,
  HStack,
  Stack,
  Text,
  Divider,
  Input,
  Spacer,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Grid,
  GridItem,
  useToast,
} from "@chakra-ui/react";
import { Icon } from "@chakra-ui/react";
import {
  BiBriefcase,
  BiCreditCardFront,
  BiMapPin,
  BiTrip,
  BiUser,
} from "react-icons/bi";
import { HiOutlineLocationMarker, HiOutlineMap } from "react-icons/hi";
import { Controller, useForm } from "react-hook-form";
import {
  VendorProfile,
  VendorProfileDetailsFormData,
} from "types/vendor.types";
import {
  parseAPIDataToFormData,
  parseFormDataToAPIData,
  useVendorProfileUpdateMutation,
  usePaymentMethods,
} from "utils/vendor-details";
// import { t } from 'i18next';
import { useTranslation } from "react-i18next";
import "components/translation/i18n";

const textStyle = {
  color: "#2D3748",
  fontSize: "16px",
  fontWeight: 500,
  lineHeight: "24px",
  mb: "5px",
};

type FieldInfoCardProps = {
  title: string;
  value: string;
  icon?: React.ElementType;
};
const FieldInfoCard: React.FC<FieldInfoCardProps> = ({
  value,
  title,
  icon,
}) => {
  return (
    <Box>
      <HStack alignItems="start">
        {icon && <Icon as={icon} boxSize={7} color="#718096" />}
        <VStack spacing={1} alignItems="start">
          <Text
            color="#2D3748"
            fontWeight={700}
            fontSize="16px"
            lineHeight="24px"
            fontStyle="normal"
          >
            {title}
          </Text>
          <Text
            color="#4A5568"
            fontSize="13px"
            fontWeight={400}
            fontStyle="normal"
            pb="20px"
          >
            {value}
          </Text>
        </VStack>
      </HStack>
      <Box w="95%">
        <Divider />
      </Box>
    </Box>
  );
};

export const Details: React.FC<{
  vendorProfileData: VendorProfile;
}> = (props) => {
  const toast = useToast();
  const { vendorProfileData } = props;
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VendorProfileDetailsFormData>({
    defaultValues: {
      primaryContact: "",
      secondaryContact: "",
      businessPhoneNumber: "",
      businessNumberExtention: "",
      secondaryNumber: "",
      secondaryNumberExtenstion: "",
      primaryEmail: "",
      secondaryEmail: "",
    },
  });

  const { t } = useTranslation();
  const {
    mutate: updateVendorProfileDetails,
  } = useVendorProfileUpdateMutation();
  const { data: payments } = usePaymentMethods();

  useEffect(() => {
    if (!vendorProfileData) return;
    reset(parseAPIDataToFormData(vendorProfileData));
  }, [reset, vendorProfileData]);

  const submitForm = useCallback(
    (formData: VendorProfileDetailsFormData) => {
      console.log("formData", formData);
      const payload = parseFormDataToAPIData(vendorProfileData, formData);

      console.log("payload", payload);

      updateVendorProfileDetails(payload, {
        onSuccess() {
          toast({
            title: "Update Vendor Profile Details",
            description: "Vendor profile details has been saved successfully.",
            status: "success",
            isClosable: true,
            position: "top-left",
          });
        },
      });
    },
    [toast, updateVendorProfileDetails, vendorProfileData]
  );

  return (
    <Flex h="100%" direction="column">
      <Grid
        templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap="10px"
        w="100%"
        mb="30px"
      >
        <GridItem>
          <FieldInfoCard
            title={t("businessName")}
            value={`${vendorProfileData?.companyName}`}
            icon={BiBriefcase}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard
            title={t("capacity")}
            value={`${vendorProfileData?.capacity}`}
            icon={BiUser}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard
            title={t("last4digits")}
            value={`${vendorProfileData?.einNumber?.slice(-4)}`}
            icon={BiCreditCardFront}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard
            title={t("paymentMethods")}
            value={payments?.map((payment) => payment.value).toString()}
            icon={BiCreditCardFront}
          />
        </GridItem>
      </Grid>
      <Grid
        templateColumns="repeat(auto-fill, minmax(250px, 1fr))"
        gap="10px"
        w="100%"
        mb="40px"
      >
        <GridItem>
          <FieldInfoCard
            title={t("streetAddress")}
            value={`${vendorProfileData?.streetAddress}`}
            icon={BiMapPin}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard
            title={t("state")}
            value={`${vendorProfileData?.state}`}
            icon={BiTrip}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard
            title={t("city")}
            value={`${vendorProfileData?.city}`}
            icon={HiOutlineLocationMarker}
          />
        </GridItem>
        <GridItem>
          <FieldInfoCard
            title={t("zip")}
            value={`${vendorProfileData?.zipCode}`}
            icon={HiOutlineMap}
          />
        </GridItem>
      </Grid>

      {/** Note: Using chakra component Box for form element in order to style */}
      <Box as="form" onSubmit={handleSubmit(submitForm)}>
        <Flex direction="column" h="100%">
          <Box flex="1">
            <Box w="50%" mb="22px">
              <Stack spacing={4} direction={["row"]}>
                <FormControl w="320px" isInvalid={!!errors.primaryContact}>
                  <FormLabel sx={textStyle}>{t("primaryContact")}</FormLabel>
                  <Input
                    bg="#FFFFFF"
                    w="320px"
                    h="40px"
                    borderLeft="2px solid #4E87F8"
                    {...register("primaryContact", {
                      required: "This is required",
                    })}
                    id="primaryContact"
                    type="text"
                  />
                  <FormErrorMessage>
                    {errors.primaryContact && errors.primaryContact.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.secondaryContact}>
                  <FormLabel sx={textStyle}>{t("secondaryContact")}</FormLabel>
                  <Input
                    bg="#FFFFFF"
                    w="320px"
                    h="40px"
                    {...register("secondaryContact")}
                    id="secondaryContact"
                    type="text"
                  />
                  <FormErrorMessage>
                    {errors.secondaryContact && errors.secondaryContact.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </Box>

            <Box mb="22px" w="50%">
              <Stack direction="row" spacing={4}>
                <FormControl isInvalid={!!errors.businessPhoneNumber}>
                  <FormLabel sx={textStyle}>{t("businessPhoneName")}</FormLabel>
                  <Input
                    bg="#FFFFFF"
                    w="320px"
                    h="40px"
                    borderLeft="2px solid #4E87F8"
                    mb="5px"
                    {...register("businessPhoneNumber", {
                      required: "This is required",
                    })}
                    id="businessPhoneNumber"
                    type="text"
                  />
                  <FormErrorMessage>
                    {errors.businessPhoneNumber &&
                      errors.businessPhoneNumber.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  w="100px"
                  isInvalid={!!errors.businessNumberExtention}
                >
                  <FormLabel sx={textStyle}>Ext</FormLabel>
                  <Input
                    bg="#FFFFFF"
                    w="96px"
                    h="40px"
                    {...register("businessNumberExtention")}
                    id="businessNumberExtention"
                    type="text"
                  />
                  <FormErrorMessage>
                    {errors.businessNumberExtention &&
                      errors.businessNumberExtention.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.secondaryNumber}>
                  <FormLabel sx={textStyle}>{t("secondaryNo")}</FormLabel>
                  <Controller
                    name="secondaryNumber"
                    control={control}
                    render={({ field }) => {
                      return (
                        <Input
                          {...field}
                          bg="#FFFFFF"
                          w="320px"
                          h="40px"
                          id="SecondaryNo"
                          placeholder="(___)-___-____"
                          autoComplete="cc-number"
                          type="text"
                          inputMode="text"
                          onChange={(event) => {
                            const value = event.currentTarget.value;
                            const denormarlizedValue = value
                              .split("-")
                              .join("");

                            const maskValue = denormarlizedValue
                              ?.replace(/\D/g, "")
                              .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);
                            const actualValue = `(${maskValue?.[1] || "___"})-${
                              maskValue?.[2] || "___"
                            }-${maskValue?.[3] || "____"}`;
                            field.onChange(actualValue);
                          }}
                        />
                      );
                    }}
                  />
                  <FormErrorMessage>
                    {errors.secondaryNumber && errors.secondaryNumber.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl
                  w="100px"
                  isInvalid={!!errors.secondaryNumberExtenstion}
                >
                  <FormLabel sx={textStyle}>Ext</FormLabel>
                  <Input
                    bg="#FFFFFF"
                    w="96px"
                    h="40px"
                    id="Ext"
                    {...register("secondaryNumberExtenstion")}
                    type="text"
                  />
                  <FormErrorMessage>
                    {errors.secondaryNumberExtenstion &&
                      errors.secondaryNumberExtenstion.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </Box>

            <Box w="50%" mb="22px">
              <Stack direction="row" spacing={4}>
                {/* Primary Email => Input */}

                <FormControl w="320px" isInvalid={!!errors.primaryEmail}>
                  <FormLabel sx={textStyle}>{t("primaryEmail")}</FormLabel>
                  <Input
                    bg="#FFFFFF"
                    w="320px"
                    h="40px"
                    borderLeft="2px solid #4E87F8"
                    {...register("primaryEmail", {
                      required: "primaryEmail is required",
                    })}
                    id="primaryEmail"
                    type="text"
                  />
                  <FormErrorMessage>
                    {errors.primaryEmail && errors.primaryEmail.message}
                  </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.secondaryEmail}>
                  <FormLabel sx={textStyle}>{t("secondaryEmail")}</FormLabel>
                  <Input
                    bg="#FFFFFF"
                    w="320px"
                    {...register("secondaryEmail")}
                    h="40px"
                    id="secondaryEmail"
                    type="text"
                  />
                  <FormErrorMessage>
                    {errors.secondaryEmail && errors.secondaryEmail.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
            </Box>
          </Box>

          <Stack mt="100px" w="100%">
            <Box>
              <Divider />
            </Box>
            <HStack>
              <Spacer />
              <Box w="120px" pt="10px">
                <Button size="lg" colorScheme="button" type="submit">
                  {t("save")}
                </Button>
              </Box>
            </HStack>
          </Stack>
        </Flex>
      </Box>
    </Flex>
  );
};
