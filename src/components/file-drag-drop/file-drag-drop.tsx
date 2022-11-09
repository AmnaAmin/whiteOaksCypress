import {
  Box,
  DefaultIcon,
  Divider,
  Flex,
  Text
} from "@chakra-ui/react";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { BiImport } from 'react-icons/bi'

const getFileSize = (byte) => {
  return Number(byte/1000000);
}

const readDocuments = (docs, onComplete) => {
  const documents = [...docs];

  const readFile = (doc) => (event) => {
    const arry = event.target.result.split(",");
    let document = { ...doc, fileObject: arry[1] };

    const id = document.name;
    delete document.id;

    document = { ...documents, fileObjectContentType: doc.type };
    documents[id] = document;
  };

  docs.forEach((file) => {
    const reader = new FileReader();
    reader.addEventListener("load", readFile(file));
    reader.readAsDataURL(file);
  });
  onComplete(documents);
};

export default function App() {
  const [files, setFiles] = useState([]);
  const [documents, setDocuments] = useState({});

  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles.map((file) => file));
    readDocuments(acceptedFiles, (documents) => {
      console.log(documents[0]);
      setDocuments(documents);
    });
  };

  return (
    <Flex
      width="100%"
      direction="column"
      gap="30px"
    >
      <Dropzone onDrop={handleDrop}>
        {({ getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject }) => {
          const additionalClass = isDragAccept
            ? "accept"
            : isDragReject
            ? "reject"
            : "";

          return (
            <Flex
              alignItems="center"
              justifyContent="center"
              {...getRootProps({
                className: `${additionalClass}`
              })}
              style={{
                width: "100%",
                height: "115px",
                border: "2px dashed #4A5568",
                borderRadius: "15px",
                backgroundColor: "#F7FAFC"
              }}
            >
              <input {...getInputProps()} />
              <Flex
                direction="column"
                gap="10px"
                alignItems="center"
                style={{
                  fontSize: "14px",
                  lineHeight: "24px",
                  fontWeight: "bold",
                  color: "#4A5568",
                }}
              >
                <BiImport style={{width:'24px', height: '24px', color: '#718096'}} />
                {
                  isDragActive
                  ? <Text as="span">Drop Here</Text>
                  : (
                    <>
                      <Text as="span">Drag & Drop</Text>
                      <Text as="span" color='#718096'>Or Choose your files.</Text>
                    </>
                  )
                }
              </Flex>
            </Flex>
          );
        }}
      </Dropzone>
      <UploadedFiles files={files} />
    </Flex>
  );
}

function UploadedFiles({ files }) {
  if (files?.length > 0) {
    
    return (
      <Flex direction="column" gap="20px">
        <Flex alignItems="center">
          <Text
            width="150px"
            color="#4A5568"
            fontSize="14px"
            fontWeight="500"
            lineHeight="20px"
          >
            Uploaded Files
          </Text>
          <Divider
            orientation="horizontal"
            style={{
              height: "1px",
              backgroundColor: "#CBD5E0"
            }}
          />
        </Flex>
        <Flex direction="column" gap="8px">
          {files.map((file, index) => (
            <Flex
              key={`${file.name}-${index}`}
              alignItems="center"
              justifyContent="space-between"
              style={{
                backgroundColor: "#F7FAFE",
                border: "1px solid #E2E8F0",
                borderRadius: "6px",
                maxWidth: "307px",
                padding: "5px 25px",
                fontSize: "14px",
                fontWeight: "bold",
                lineHeight: "24px",
                color: "#4A5568"
              }}
            >
              <Flex gap="10px">
                <DefaultIcon width="24px" height="24px" />
                <Text as="span" noOfLines={1} width="170px">
                  {file.name}
                </Text>
              </Flex>
              <Text as="span">{getFileSize(file.size)}mb</Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    );
  }
  return null;
}
