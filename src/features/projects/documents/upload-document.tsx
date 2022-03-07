import React, { useRef, useState, useCallback } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalBody,
  Button,
  FormControl,
  FormLabel,
  Select,
  HStack,
  Box,
  FormErrorMessage,
  VStack,
  ModalCloseButton,
} from "@chakra-ui/react";
import { MdOutlineCancel } from "react-icons/md";
import { documentTypes, useUploadDocument } from "utils/vendor-projects";
// import { t } from 'i18next';
import { useTranslation } from "react-i18next";
import { useUserProfile } from "utils/redux-common-selectors";
import { Account } from "types/account.types";
import { Document } from "types/vendor.types";

export const UploadDocumentModal: React.FC<any> = ({
  isOpen,
  onClose,
  projectId,
  setLatestUploadedDoc,
}) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [document, setDocument] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState("");
  const [isError, setError] = useState(false);
  const { vendorId } = useUserProfile() as Account;
  const { mutate: saveDocument } = useUploadDocument();

  const onFileChange = useCallback(
    (e) => {
      const files = e.target.files;
      if (files[0]) {
        setDocument(files[0]);
      }
    },
    [setDocument]
  );

  const resetUpload = useCallback(() => {
    setDocument(null);
    setDocumentType("");
    setError(false);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [setDocument, setDocumentType, setError, inputRef]);

  const onDocumentTypeChange = useCallback(
    (e) => {
      if (e.target.value !== "") {
        setError(false);
      } else {
        setError(true);
      }
      setDocumentType(e.target.value);
    },
    [setError, setDocumentType]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  function readFile(event: any) {
    const blob = event.target.result.split(",")[1];
    const doc: Document = {
      documentType,
      fileObject: blob,
      fileObjectContentType: document?.type || "",
      fileType: document?.name || "",
      path: document?.name,
      projectId,
      vendorId,
    };
    saveDocument(doc, {
      onSuccess() {
        setLatestUploadedDoc(doc);
        resetUpload();
        onClose();
      },
    });
  }

  const uploadDocument = useCallback(
    (e) => {
      if (documentType === "") {
        setError(true);
        return;
      }
      if (document) {
        const reader = new FileReader();
        reader.addEventListener("load", readFile);
        reader.readAsDataURL(document);
      } else {
        return;
      }
    },
    [documentType, document, setError, readFile]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        resetUpload();
        onClose();
      }}
      size="md"
    >
      <ModalOverlay />
      <ModalContent minW="71em" h="24em">
        <ModalHeader
          fontSize="18px"
          borderBottom="1px solid #E2E8F0"
          borderTop="2px solid #4E87F8"
        >
          {t("upload")}
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: "none" }} />
        <ModalBody>
          <FormControl mt="35px" isInvalid={isError}>
            <VStack align="start">
              <FormLabel fontSize="16px" htmlFor="documentType">
                {t("documentType")}{" "}
              </FormLabel>
              <HStack spacing="20px">
                <Select
                  w="320px"
                  id="documentType"
                  placeholder="Select"
                  size="lg"
                  onChange={onDocumentTypeChange}
                >
                  {documentTypes.map((type) => (
                    <option value={type.id} key={type.id}>
                      {type.value}
                    </option>
                  ))}
                </Select>
                <input
                  type="file"
                  ref={inputRef}
                  style={{ display: "none" }}
                  onChange={onFileChange}
                ></input>
                {document ? (
                  <Box
                    color="barColor.100"
                    border="1px solid #e2e8f0"
                    a
                    borderRadius="3px"
                    fontSize="16px"
                  >
                    <HStack
                      spacing="5px"
                      h="37px"
                      padding="10px"
                      align="center"
                    >
                      <Box
                        as="span"
                        maxWidth="500px"
                        whiteSpace="nowrap"
                        overflow="hidden"
                        textOverflow="ellipsis"
                      >
                        {document.name}
                      </Box>
                      <MdOutlineCancel
                        cursor="pointer"
                        onClick={() => {
                          setDocument(null);
                          if (inputRef.current) inputRef.current.value = "";
                        }}
                      />
                    </HStack>
                  </Box>
                ) : (
                  <Button
                    onClick={(e) => {
                      if (inputRef.current) {
                        inputRef.current.click();
                      }
                    }}
                    size="lg"
                    variant="outline"
                    color="barColor.100"
                  >
                    {t("chooseFile")}{" "}
                  </Button>
                )}
              </HStack>
              {isError && (
                <FormErrorMessage>Document type is required</FormErrorMessage>
              )}
            </VStack>
          </FormControl>
        </ModalBody>
        <ModalFooter
          display="flex"
          alignItems="center"
          borderTop="1px solid #E2E8F0"
        >
          <Button
            variant="ghost"
            onClick={() => {
              resetUpload();
              onClose();
            }}
          >
            {t("close")}
          </Button>
          <Button
            onClick={uploadDocument}
            colorScheme="button"
            type="submit"
            ml="3"
          >
            {t("save")}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
