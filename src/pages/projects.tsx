import { Box, Button, Heading, Stack, VStack } from "@chakra-ui/react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsBoxArrowUp } from "react-icons/bs";
import TableColumnSettings from "../components/table/table-column-settings";
import { ProjectFilters } from "../features/projects/project-fliters";
import {
  ProjectsTable,
  PROJECT_COLUMNS,
} from "../features/projects/projects-table";
import { TableNames } from "../types/table-column.types";
import {
  useTableColumnSettings,
  useTableColumnSettingsUpdateMutation,
} from "utils/table-column-settings";

export const Projects = () => {
  const { t } = useTranslation();
  const [projectTableInstance, setInstance] = useState<any>(null);
  const { mutate: postProjectColumn } = useTableColumnSettingsUpdateMutation(
    TableNames.project
  );
  const { tableColumns, resizeElementRef, settingColumns, isLoading } =
    useTableColumnSettings(PROJECT_COLUMNS, TableNames.project);
  const [selectedCard, setSelectedCard] = useState<string>("");
  const setProjectTableInstance = (tableInstance) => {
    setInstance(tableInstance);
  };

  const onSave = (columns) => {
    postProjectColumn(columns);
  };

  return (
    <>
      <Box mb={4}>
        <Heading color="#4A5568" fontSize={20} fontWeight={800}>
          {t("projectsHeading")}
        </Heading>
      </Box>
      <VStack w="100%" h="calc(100vh - 160px)">
        <Box mb={7} w="100%">
          <ProjectFilters
            onSelectCard={setSelectedCard}
            selectedCard={selectedCard}
          />
        </Box>
        <Stack
          w={{ base: "971px", xl: "100%" }}
          direction="row"
          justify="flex-end"
          pb="10px"
          spacing={5}
        >
          <Button
            bg="#4E87F8"
            color="white"
            _hover={{ bg: "royalblue" }}
            size="md"
            onClick={() => {
              if (projectTableInstance) {
                projectTableInstance?.exportData("xlsx", false);
              }
            }}
          >
            <Box pos="relative" right="6px" fontWeight="bold" pb="3.3px">
              <BsBoxArrowUp />
            </Box>
            {t("export")}
          </Button>
          {settingColumns && (
            <TableColumnSettings
              disabled={isLoading}
              onSave={onSave}
              columns={settingColumns}
            />
          )}
        </Stack>

        <Box w="100%" flex={1} boxShadow="1px 0px 70px rgb(0 0 0 / 10%)">
          <ProjectsTable
            selectedCard={selectedCard as string}
            setTableInstance={setProjectTableInstance}
            resizeElementRef={resizeElementRef}
            projectColumns={tableColumns}
          />
        </Box>
      </VStack>
    </>
  );
};
