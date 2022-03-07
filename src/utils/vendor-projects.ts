import { useClient } from "utils/auth-context";
import { Document } from "../types/vendor.types";
import { useToast } from "@chakra-ui/toast";
import { useMutation, useQuery } from "react-query";

export const useUploadDocument = () => {
  const client = useClient();
  const toast = useToast();

  return useMutation(
    (doc: Document) => {
      return client("documents", {
        data: doc,
      });
    },
    {
      onSuccess() {
        toast({
          title: "New Transaction.",
          description: "Transaction has been created successfully.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      },
    }
  );
};

export const useDocuments = ({
  projectId,
  latestUploadedDoc,
  wendorId,
}: {
  projectId: string | undefined;
  latestUploadedDoc?: Document;
  wendorId?: string;
}) => {
  const client = useClient();

  const { data: documents, ...rest } = useQuery<Array<Document>>(
    ["documents", projectId, wendorId, latestUploadedDoc],
    async () => {
      const response = await client(
        `documents?projectId.equals=${projectId}${
          wendorId ? "&workorderId.equals=" + wendorId : ""
        }&sort=modifiedDate,asc`,
        {}
      );
      return response?.data;
    }
  );

  return {
    documents,
    ...rest,
  };
};

export const documentTypes = [
  { id: 56, value: "Drawings" },
  { id: 57, value: "NOC" },
  { id: 39, value: "Original SOW" },
  { id: 58, value: "Other" },
  { id: 19, value: "Photos" },
  { id: 18, value: "Reciept" },
];
