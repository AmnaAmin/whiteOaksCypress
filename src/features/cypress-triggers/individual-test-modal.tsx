import React, { useCallback, useEffect } from 'react';
import {
  Box,
  Button,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

interface IndividualTestModalProps {
  onClose: () => void;
  isOpen: boolean;
}

export const IndividualTestModal: React.FC<IndividualTestModalProps> = ({ onClose: close, isOpen }) => {
  const { t } = useTranslation();
  const { register, handleSubmit, reset } = useForm();
  const {   onClose: onCloseDisclosure } = useDisclosure();

  const onClose = useCallback(() => {
    onCloseDisclosure();
    close();
  }, [close, onCloseDisclosure]);

  const onSubmit = async (data) => {
    
    const token = "bkua_381e83ae5ef0f1f90623f199aa89a1c79d902a3f";
    const branch = "preprod-automation-module2";

    console.log('Folder Number:', data.folderNumber);
    try {
      // Use axios to trigger the Buildkite REST API with the appropriate parameters
      const response = await axios.post(
        `https://api.buildkite.com/v2/organizations/DevTek/pipelines/next-gen-whiteoaks-ui/builds`,
        {
          "commit": "HEAD",
          "branch": branch,
          "message": "Prompt Build.",
          "env": {
            "ENV": "preprod-Automation"
          },
          "meta_data": {
            "folderNumber" : data.folderNumber
          }
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": 'Bearer '+token, 
          },
        }
      );
      // Handle the response as needed
      console.log('Build triggered successfully:', response.data);
    } catch (error) {
      // Handle errors
      console.error(error);
    }
    onClose(); // Close the modal after submission
  };

  useEffect(() => {
    // Additional setup logic on modal open
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent rounded={8}>
        <ModalHeader borderBottom="1px solid #E2E8F0">
          <FormLabel variant="strong-label" m={0}>
            {t('Run Individual Test')}
          </FormLabel>
        </ModalHeader>
        <ModalCloseButton
          onClick={() => {
            onClose();
            reset();
          }}
        />
        <form onSubmit={handleSubmit(onSubmit)}>
          <ModalBody p={4}>
            <Box>
              <Box px={5}>
                <Box w="100%">
                  <FormLabel variant="strong-label">{t('Folder Number')}</FormLabel>
                  <Input type="text" {...register('folderNumber')} />
                </Box>
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter borderTop="1px solid #E2E8F0" mt="4">
            <Button
              variant="outline" colorScheme="brand" mr={3}
              onClick={() => {
                onClose();
                reset();}} >
              Cancel
            </Button>
            <Button colorScheme="brand" type="submit">
              Run Test
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};