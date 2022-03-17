import {
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useEffect } from "react";
import { BiText } from "react-icons/bi";
import { SignatureTab } from "./signature-type-tab";
import { useTranslation } from "react-i18next";

const SignatureModal = ({
  open,
  onClose: close,
  setSignature,
}: {
  open: boolean;
  onClose: () => void;
  setSignature: (string) => void;
}) => {
  const { t } = useTranslation();
  const { isOpen, onOpen, onClose: onCloseDisclosure } = useDisclosure();
  // const [tabIndex, setTabIndex] = useState(0);

  const onClose = useCallback(() => {
    onCloseDisclosure();
    close();
  }, [close, onCloseDisclosure]);

  useEffect(() => {
    if (open) {
      onOpen();
    } else {
      onCloseDisclosure();
    }
  }, [open, onOpen, onCloseDisclosure]);

  return (
    <Modal
      blockScrollOnMount={false}
      isOpen={isOpen}
      onClose={onClose}
      size="6xl"
    >
      <ModalOverlay />
      <ModalContent h="70vh">
        <ModalHeader
          color="gray.700"
          fontWeight={700}
          fontSize="18px"
          fontStyle="normal"
        >
          {t("addSignature")}
        </ModalHeader>
        <ModalCloseButton _focus={{ outline: "none" }} />
        <Divider mb={3} />
        <ModalBody h="50vh" overflow="scroll">
          <Stack w={{ base: "900px", xl: "100%" }} spacing={5}>
            <Tabs variant="enclosed">
              <TabList>
                <Tab
                  minW={105}
                  _selected={{
                    color: "button.300",
                    borderBottom: "1px solid",
                    borderBottomColor: "button.300",
                  }}
                >
                  <BiText />
                  {t("type")}
                </Tab>
              </TabList>

              <TabPanels mt="31px">
                <TabPanel p="0px">
                  <SignatureTab onClose={onClose} setSignature={setSignature} />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SignatureModal;
