import React from "react";
import {
  Box,
  Center,
  CenterProps,
  Flex,
  Progress,
  Text,
} from "@chakra-ui/react";
import { dateFormat } from "utils/date-time-utils";
import Status from "../status";
// import { t } from 'i18next';
import { useTranslation } from "react-i18next";
import { ProjectType } from "types/project.type";

const InfoStructureCard: React.FC<{ isLoading: boolean } & CenterProps> = ({
  children,
  isLoading,
  title,
  ...rest
}) => {
  return (
    <Center
      flexDir="column"
      borderRight="1px solid #E5E5E5"
      padding={5}
      flex={rest.flex || 1}
      {...rest}
      fontSize={14}
      color="#4A5568"
    >
      <Box fontWeight={500}>
        <Text color="#A0AEC0">{title}</Text>
        {isLoading ? (
          <Progress size="sm" isIndeterminate colorScheme="gray" />
        ) : (
          children
        )}
      </Box>
    </Center>
  );
};

export const TransactionInfoCard: React.FC<{
  projectData: ProjectType;
  isLoading: boolean;
}> = ({ projectData, isLoading }) => {
  const { t } = useTranslation();

  return (
    <Flex
      h={{ base: "unset", xl: "97px" }}
      w="100%"
      bg="white"
      borderRadius="4px"
      box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
    >
      <InfoStructureCard title={t("projectID")} isLoading={isLoading}>
        <Text>{projectData?.id}</Text>
      </InfoStructureCard>

      <InfoStructureCard isLoading={isLoading} title={t("WOstatus")}>
        <Box>
          {projectData?.vendorWOStatusValue ? (
            <Status
              value={projectData?.vendorWOStatusValue}
              id={projectData?.vendorWOStatusValue}
            />
          ) : (
            <Text>--</Text>
          )}
        </Box>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t("WODueDate")}>
        <Text>{dateFormat(projectData?.clientDueDate as string)}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t("contactName")}>
        <Text>{projectData?.projectManager}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t("contactNo")}>
        <Text>{projectData?.projectManagerPhoneNumber}</Text>
      </InfoStructureCard>
      <InfoStructureCard isLoading={isLoading} title={t("address")} flex={2}>
        {`${projectData?.streetAddress}, ${projectData?.city}, ${projectData?.region}/${projectData?.zipCode}`}
      </InfoStructureCard>
    </Flex>
  );
};
