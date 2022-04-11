import React from "react";
import { Box, Td, Tr, Text, Flex } from "@chakra-ui/react";
import { useColumnWidthResize } from "utils/hooks/useColumnsWidthResize";
import { dateFormat } from "utils/date-time-utils";
import ReactTable, { RowProps } from "components/table/react-table";
import { useProjectAlerts } from "utils/projects";
import { useParams } from "react-router-dom";
import { useAuth } from "utils/auth-context";

enum PROJECT_CATEGORY {
  WARNING = 1,
  INFO = 2,
  ERROR = 3,
}

const alertsRow: React.FC<RowProps> = ({ row, style, onRowClick }) => {
  return (
    <Tr
      bg="white"
      _hover={{
        background: "#eee",
      }}
      onClick={(e) => {
        if (onRowClick) {
          onRowClick(e, row);
        }
      }}
      {...row.getRowProps({
        style,
      })}
    >
      {row.cells.map((cell) => {
        return (
          <Td {...cell.getCellProps()} key={`row_${cell.value}`} p="0">
            <Flex alignItems="center" h="60px">
              <Text
                noOfLines={2}
                title={cell.value}
                padding="0 15px"
                color="blackAlpha.600"
              >
                {cell.render("Cell")}
              </Text>
            </Flex>
          </Td>
        );
      })}
    </Tr>
  );
};

export const AlertsTable = (props: any) => {
  const { data } = useAuth();
  const account = data?.user;

  const { projectId } = useParams<"projectId">();

  const { data: alerts } = useProjectAlerts(projectId, account?.login);

  const { columns, resizeElementRef } = useColumnWidthResize([
    {
      Header: <input type="checkbox"></input>,
      accessor: "checkbox",
      Cell: () => <input type="checkbox"></input>,
    },
    {
      Header: "Name",
      accessor: "subject",
    },
    {
      Header: "Type",
      accessor: "triggeredType",
    },
    {
      Header: "Value",
      accessor: "attribute",
    },
    {
      Header: "Category",
      accessor: "category",
      Cell: ({ value }) => PROJECT_CATEGORY[value],
    },
    {
      Header: "Date Triggered",
      accessor: "dateCreated",
      Cell: ({ value }) => dateFormat(value),
    },
  ]);

  return (
    <Box ref={resizeElementRef}>
      <ReactTable
        onRowClick={props.onRowClick}
        columns={columns}
        data={alerts || []}
        TableRow={alertsRow}
        tableHeight="calc(100vh - 300px)"
        name="alerts-table"
      />
    </Box>
  );
};
