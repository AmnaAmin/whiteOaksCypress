import React, { useCallback, useEffect } from "react";
import { Box, Button, HStack, Avatar, Text, Flex } from "@chakra-ui/react";

import "react-datepicker/dist/react-datepicker.css";
import { useForm } from "react-hook-form";
import { SettingsValues } from "../types/vendor.types";
import {
  readFileContent,
  useSaveSettings,
  languageOptions,
  useAccountDetails,
} from "utils/vendor-details";
import { FormSelect } from "../components/react-hook-form-fields/select";
import { FormInput } from "../components/react-hook-form-fields/input";
import { FormFileInput } from "../components/react-hook-form-fields/file-input";
import { useTranslation } from "react-i18next";

export const Settings = React.forwardRef((props, ref) => {
  const { mutate: saveSettings } = useSaveSettings();
  const { data: account, refetch } = useAccountDetails();
  // const [lang, setLanguage] = useState(account?.langKey);
  const { i18n, t } = useTranslation();

  const settingsDefaultValue = (account) => {
    const settings = {
      firstName: account.firstName,
      lastName: account.lastName,
      email: account.login,
      language: account.langKey,
      profilePicture: null,
    };
    return settings;
  };

  useEffect(() => {
    refetch();
    const element = document.getElementById("Avatar");
    element?.classList.add("form-file-input");
  }, [refetch]);

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    watch,
    reset,
  } = useForm<SettingsValues>();

  useEffect(() => {
    if (account) {
      const defaultSettings = settingsDefaultValue(account);
      reset(defaultSettings);
    }
  }, [account, reset]);

  /* debug purpose */
  const watchAllFields = watch();
  React.useEffect(() => {
    const subscription = watch((value) => {
      console.log("Value Change", value);
    });
    return () => subscription.unsubscribe();
  }, [watch, watchAllFields]);

  const onSubmit = useCallback(
    async (values) => {
      let fileContents: any = null;
      if (values.profilePicture && values.profilePicture[0]) {
        fileContents = await readFileContent(values.profilePicture[0]);
      }
      const settingsPayload = {
        firstName: values.firstName,
        lastName: values.lastName,
        langKey: values.language,
        login: values.email,
        avatarName:
          values.profilePicture && values.profilePicture[0]
            ? values.profilePicture[0].type
            : null,
        avatar: fileContents,
      };
      saveSettings(settingsPayload);
      setTimeout(() => {
        refetch();
      }, 2000); // call for refetch because we are getting no response from current api. Needs to change when correct response is receieved
      // setLanguage(values.language);
      i18n.changeLanguage(values.language);
    },
    [i18n, refetch, saveSettings]
  );

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Text fontSize="xl" mb={10}>
          {t("settingsFor")} [{account ? account.email : null}]
        </Text>

        <Flex id="Avatar">
          <FormFileInput
            errorMessage={errors.profilePicture}
            label={"Profile Picture"}
            name={`profilePicture`}
            register={register}
            isRequired={false}
            id="Avatar"
          >
            <Avatar src={account?.imageUrl} />
            <Text m={4} color={"lightgrey"} width="350px">
              Change your Profile Picture
            </Text>
          </FormFileInput>
        </Flex>
        <HStack>
          <FormInput
            errorMessage={errors.firstName && errors.firstName?.message}
            label={t("firstName")}
            placeholder={"First Name"}
            register={register}
            controlStyle={{ w: "20em" }}
            elementStyle={{ bg: "white", borderLeft: "1.5px solid #4E87F8" }}
            rules={{ required: "This is required field" }}
            name={`firstName`}
          />
          <FormInput
            errorMessage={errors.lastName && errors.lastName?.message}
            label={t("lastName")}
            placeholder="Last Name"
            register={register}
            controlStyle={{ w: "20em" }}
            elementStyle={{ bg: "white", borderLeft: "1.5px solid #4E87F8" }}
            rules={{ required: "This is required field" }}
            name={`lastName`}
          />
        </HStack>

        <FormInput
          errorMessage={errors.email && errors.email?.message}
          label={t("email")}
          placeholder="Email"
          register={register}
          disabled={true}
          controlStyle={{ w: "20em" }}
          elementStyle={{ bg: "white", borderLeft: "1.5px solid #4E87F8" }}
          rules={{ required: "This is required field" }}
          name={`email`}
        />
        <FormSelect
          errorMessage={errors.language && errors.language?.message}
          label={t("language")}
          name={`language`}
          control={control}
          options={languageOptions}
          rules={{ required: "This is required field" }}
          controlStyle={{ w: "20em" }}
          elementStyle={{ bg: "white", borderLeft: "1.5px solid #4E87F8" }}
        />
        <Box
          id="footer"
          w="100%"
          align="end"
          mt={25}
          padding="10px"
          borderTop="1px solid #E2E8F0"
          minH="60px"
        >
          <Button
            float={"right"}
            ml="5px"
            mt={10}
            colorScheme="button"
            type="submit"
          >
            {t("save")}
          </Button>
        </Box>
      </form>
    </Box>
  );
});
