import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Image,
  Link,
  ModalFooter,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import InputView from "components/input-view/input-view";
import { convertImageToDataURL, trimCanvas } from "components/table/util";
import { dateFormat } from "utils/date-time-utils";
import { downloadFile } from "utils/file-utils";
import jsPdf from "jspdf";
import { orderBy } from "lodash";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { BiBookAdd, BiCaretDown, BiCaretUp, BiTrash } from "react-icons/bi";
import { useParams } from "react-router-dom";
import { FormInput } from "components/react-hook-form-fields/input";
import {
  createForm,
  getHelpText,
  useLienWaiverMutation,
} from "utils/lien-waiver";
import { useDocuments } from "utils/vendor-projects";

import SignatureModal from "./signature-modal";
import { useTranslation } from "react-i18next";

export const LienWaiverTab: React.FC<any> = (props) => {
  const { t } = useTranslation();
  const { lienWaiverData, onClose } = props;
  const { mutate: updateLienWaiver, isSuccess } = useLienWaiverMutation();
  const [documents, setDocuments] = useState<any[]>([]);
  const { projectId } = useParams<"projectId">();
  const { documents: documentsData = [] } = useDocuments({
    projectId,
    wendorId: lienWaiverData.id,
  });
  const [recentLWFile, setRecentLWFile] = useState<any>(null);
  const [openSignature, setOpenSignature] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sigRef = useRef<HTMLImageElement>(null);

  const {
    register,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      claimantName: lienWaiverData.claimantName,
      customerName: lienWaiverData.customerName,
      propertyAddress: lienWaiverData.propertyAddress,
      owner: lienWaiverData.owner,
      makerOfCheck: lienWaiverData.makerOfCheck,
      amountOfCheck: lienWaiverData.amountOfCheck,
      checkPayableTo: lienWaiverData.claimantName,
      claimantsSignature: lienWaiverData.claimantsSignature,
      claimantTitle: lienWaiverData.claimantTitle,
      dateOfSignature: lienWaiverData.dateOfSignature,
    },
  });
  const value = getValues();
  const parseValuesToPayload = (formValues, documents) => {
    return {
      ...lienWaiverData,
      ...formValues,
      documents,
    };
  };
  const onSubmit = (formValues) => {
    const lienWaiverData = parseValuesToPayload(formValues, documents);
    updateLienWaiver(lienWaiverData);
  };
  useEffect(() => {
    if (isSuccess) onClose();
  }, [isSuccess, onClose]);

  useEffect(() => {
    if (!documentsData?.length) return;
    const orderDocs = orderBy(documentsData, ["modifiedDate"], ["desc"]);
    const signatureDoc = orderDocs.find(
      (doc) => parseInt(doc.documentType, 10) === 108
    );
    const recentLW = orderDocs.find(
      (doc) => parseInt(doc.documentType, 10) === 26
    );
    setRecentLWFile(recentLW);
    setValue("claimantsSignature", signatureDoc?.s3Url);
  }, [documentsData, setValue]);

  const generatePdf = useCallback(() => {
    let form = new jsPdf();
    const value = getValues();
    const dimention = {
      width: sigRef?.current?.width,
      height: sigRef?.current?.height,
    };
    convertImageToDataURL(value.claimantsSignature, (dataUrl: string) => {
      form = createForm(form, getValues(), dimention, dataUrl);
      const pdfUri = form.output("datauristring");
      const pdfBlob = form.output("bloburi");
      setRecentLWFile({
        s3Url: pdfBlob,
        fileType: "Lien-Waver-Form.pdf",
      });
      setDocuments((doc) => [
        ...doc,
        {
          documentType: 26,
          fileObject: pdfUri.split(",")[1],
          fileObjectContentType: "application/pdf",
          fileType: "Lien-Waver-Form.pdf",
        },
      ]);
    });
  }, [getValues]);

  const generateTextToImage = (value) => {
    const context = canvasRef?.current?.getContext("2d");

    if (!context) return;

    context.clearRect(
      0,
      0,
      canvasRef?.current?.width ?? 0,
      canvasRef?.current?.height ?? 0
    );
    context.font = "italic 500 12px Inter";
    context.textAlign = "start";
    context.fillText(value, 10, 50);
    const trimContext = trimCanvas(canvasRef.current);

    const uri = trimContext?.toDataURL("image/png");
    setDocuments((doc) => [
      ...doc,
      {
        documentType: 108,
        fileObject: uri?.split(",")[1],
        fileObjectContentType: "image/png",
        fileType: "Claimants Signature.png",
      },
    ]);
    setValue("claimantsSignature", uri);
  };

  const onSignatureChange = (value) => {
    generateTextToImage(value);
    setValue("dateOfSignature", new Date(), { shouldValidate: true });
  };
  const onRemoveSignature = () => {
    setValue("claimantsSignature", null);
    setValue("dateOfSignature", null);
  };
  return (
    <Stack>
      <SignatureModal
        setSignature={onSignatureChange}
        open={openSignature}
        onClose={() => setOpenSignature(false)}
      />

      <form
        className="lienWaver"
        id="lienWaverForm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <FormControl>
          <VStack align="start" spacing="30px">
            <Flex w="100%" alignContent="space-between" pos="relative">
              <Box flex="4" minW="59em">
                <HelpText>{getHelpText()}</HelpText>
              </Box>
              <Flex pos="absolute" top={0} right={0} flex="1">
                {recentLWFile && (
                  <Flex alignItems={"center"}>
                    <FormLabel
                      margin={0}
                      fontSize="16px"
                      fontStyle="normal"
                      fontWeight={600}
                      color="gray.700"
                    >
                      Recent LW:
                    </FormLabel>

                    <Button
                      fontSize="10px"
                      bg="white"
                      color="#4E87F8"
                      float="right"
                      mr={3}
                      textDecoration="underline"
                      onClick={() => downloadFile(recentLWFile.s3Url)}
                    >
                      <Box pos="relative" right="6px"></Box>
                      {recentLWFile.fileType}
                    </Button>
                  </Flex>
                )}

                <Button
                  bg="#4E87F8"
                  disabled={!value.claimantsSignature || recentLWFile}
                  color="#FFFFFF"
                  float="right"
                  size="md"
                  _hover={{ bg: "royalblue" }}
                  onClick={generatePdf}
                >
                  <Box pos="relative" right="6px"></Box>
                  Generate LW
                </Button>
              </Flex>
            </Flex>
            <Box>
              <VStack alignItems="start">
                <HStack>
                  <InputView
                    controlStyle={{ w: "20em" }}
                    label={t("nameofClaimant")}
                    InputElem={<Text>{lienWaiverData.claimantName}</Text>}
                  />

                  <InputView
                    controlStyle={{ w: "20em" }}
                    label={t("customerName")}
                    InputElem={<Text>{lienWaiverData.customerName}</Text>}
                  />
                </HStack>
                <HStack>
                  <InputView
                    controlStyle={{ w: "20em" }}
                    label={t("jobLocation")}
                    InputElem={<Text>{lienWaiverData.propertyAddress}</Text>}
                  />

                  <InputView
                    controlStyle={{ w: "20em" }}
                    label={t("owner")}
                    InputElem={<Text>{lienWaiverData.owner}</Text>}
                  />
                </HStack>
                <HStack>
                  <InputView
                    controlStyle={{ w: "20em" }}
                    label={t("makerOfCheck")}
                    InputElem={<Text>{lienWaiverData.makerOfCheck}</Text>}
                  />
                  <InputView
                    controlStyle={{ w: "20em" }}
                    label={t("amountOfCheck")}
                    InputElem={<Text>${lienWaiverData.amountOfCheck}</Text>}
                  />
                  <InputView
                    controlStyle={{ w: "20em" }}
                    label={t("checkPayableTo")}
                    InputElem={<Text>{lienWaiverData.claimantName}</Text>}
                  />
                </HStack>

                <HStack alignItems={"flex-start"}>
                  <FormControl
                    isInvalid={!value.claimantsSignature}
                    width={"20em"}
                  >
                    <FormLabel fontWeight={700} fontSize={"16px"}>
                      {t("claimantsSignature")}
                    </FormLabel>
                    <Flex
                      pos="relative"
                      bg="gray.50"
                      height={"64px"}
                      alignItems={"center"}
                      px={4}
                    >
                      <canvas
                        hidden
                        ref={canvasRef}
                        height={"64px"}
                        width={"1000px"}
                      ></canvas>
                      <Image
                        hidden={!value.claimantsSignature}
                        maxW={"100%"}
                        src={value.claimantsSignature}
                        {...register("claimantsSignature", {
                          required: "This is required field",
                        })}
                        ref={sigRef}
                      />

                      <Flex pos={"absolute"} right={"10px"} top={"25px"}>
                        {value.claimantsSignature && (
                          <BiTrash
                            className="mr-1"
                            onClick={onRemoveSignature}
                          />
                        )}
                        <BiBookAdd onClick={() => setOpenSignature(true)} />
                      </Flex>
                    </Flex>
                    {!value.claimantsSignature && (
                      <FormErrorMessage>
                        This is required field
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <FormInput
                    errorMessage={
                      errors.claimantTitle && errors.claimantTitle?.message
                    }
                    label={t("claimantsTitle")}
                    placeholder=""
                    register={register}
                    controlStyle={{ w: "20em" }}
                    elementStyle={{
                      bg: "white",
                      borderLeft: "1.5px solid #4E87F8",
                    }}
                    rules={{ required: "This is required field" }}
                    name={`claimantTitle`}
                  />
                  <FormInput
                    errorMessage={
                      errors.dateOfSignature && errors.dateOfSignature?.message
                    }
                    label={t("dateOfSignature")}
                    placeholder=""
                    register={register}
                    name={`dateOfSignature`}
                    value={dateFormat(value.dateOfSignature)}
                    controlStyle={{ w: "20em" }}
                    elementStyle={{
                      bg: "white",
                      borderLeft: "1.5px solid #4E87F8",
                    }}
                    rules={{ required: "This is required field" }}
                    readOnly
                  />
                </HStack>
              </VStack>
            </Box>
          </VStack>
        </FormControl>
        <Divider />
        <ModalFooter mt={3}>
          <Button
            variant="ghost"
            mr={3}
            onClick={onClose}
            color="gray.700"
            fontStyle="normal"
            fontWeight={600}
            fontSize="18px"
          >
            {t("close")}
          </Button>
          <Button
            colorScheme="CustomPrimaryColor"
            mr={3}
            type="submit"
            fontStyle="normal"
            fontWeight={600}
            fontSize="18px"
          >
            {t("save")}
          </Button>
        </ModalFooter>
      </form>
    </Stack>
  );
};

const HelpText = ({ children }) => {
  const { t } = useTranslation();
  const text = children;
  const [isReadMore, setIsReadMore] = useState(false);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };
  return (
    <>
      {!isReadMore ? (
        <Link onClick={toggleReadMore} style={{ color: "#4E87F8" }}>
          <Flex fontStyle="normal" fontWeight="500" fontSize="lg">
            <Box>{t("readMore")}</Box>
            <Box ml="3px" mt="3px">
              <BiCaretDown />
            </Box>
          </Flex>
        </Link>
      ) : (
        <Link onClick={toggleReadMore}>
          <Flex fontStyle="normal" fontWeight="500" fontSize="lg">
            <Box>{t("readLess")}</Box>
            <Box ml="3px" mt="4px">
              <BiCaretUp />
            </Box>
          </Flex>
        </Link>
      )}
      {isReadMore && (
        <Box mt="28px" className="text">
          {text}
        </Box>
      )}
    </>
  );
};
