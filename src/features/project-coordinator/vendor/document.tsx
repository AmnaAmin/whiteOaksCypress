import {
  Box,
  Stack,
  HStack,
  VStack,
  Icon,
  Text,
  Divider,
  Button,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import { FormFileInput } from 'components/react-hook-form-fields/file-input'
import { t } from 'i18next'
import React from 'react'
import { useForm } from 'react-hook-form'
import { BiDownload, BiFile } from 'react-icons/bi'

const datePickLabel = {
  fontSize: '14px',
  fontWeight: 500,
  color: 'gray.600',
}

const downloadLabel = {
  fontSize: '14px',
  fontWeight: 500,
  color: '#4E87F8',
}

const Document = () => {
  const {
    register,
    formState: { errors },
  } = useForm()
  return (
    <form>
      <Stack spacing={12}>
        <Stack alignItems="end" spacing={40} direction="row" mt="3">
          <HStack alignItems="end" spacing={4}>
            <Box>
              <HStack alignItems="start">
                <Icon as={BiFile} boxSize={5} color="#718096" />
                <VStack alignItems="start" spacing={0}>
                  <Text fontSize="14px" fontWeight={500} color="gray.600">
                    W9 Document Date
                  </Text>
                  <Text fontSize="14px" fontWeight={400} color="gray.500">
                    dd/mm/yy
                  </Text>
                </VStack>
              </HStack>
              <Divider borderWidth={1} w="250px" />
            </Box>
            <Box>
              <FormFileInput
                style={{
                  height: '40px',
                }}
                errorMessage={errors.w9DocumentDate && errors.w9DocumentDate?.message}
                label={''}
                name={`w9DocumentDate`}
                register={register}
              >
                <Button
                  rounded="none"
                  roundedLeft={5}
                  fontSize="14px"
                  fontWeight={500}
                  color="gray.600"
                  bg="gray.100"
                  h="38px"
                  w={120}
                >
                  {t('chooseFile')}
                </Button>
              </FormFileInput>
            </Box>
          </HStack>

          <HStack>
            <Icon as={BiDownload} boxSize={4} color="#4E87F8" />
            <Text sx={downloadLabel}>W9 Document</Text>
          </HStack>
        </Stack>

        <Stack spacing={40} alignItems="end" direction="row">
          <HStack alignItems="end" spacing={4}>
            <Box>
              <FormControl w="250px">
                <FormLabel sx={datePickLabel}>Agreement Signed Date</FormLabel>
                <Input type="date" />
              </FormControl>
            </Box>

            <Box>
              <FormFileInput
                style={{
                  height: '40px',
                }}
                errorMessage={errors.agreementSignedDate && errors.agreementSignedDate?.message}
                label={''}
                name={`agreementSignedDate`}
                register={register}
              >
                <Button
                  rounded="none"
                  roundedLeft={5}
                  fontSize="14px"
                  fontWeight={500}
                  color="gray.600"
                  bg="gray.100"
                  h="38px"
                  w={120}
                >
                  {t('chooseFile')}
                </Button>
              </FormFileInput>
            </Box>
          </HStack>
          <HStack>
            <Icon as={BiDownload} boxSize={4} color="#4E87F8" />
            <Text sx={downloadLabel}>W9 Document</Text>
          </HStack>
        </Stack>

        <HStack>
          <Text fontSize="18px" fontWeight={500} color="gray.600">
            Insurances
          </Text>

          <Divider pt="1" />
        </HStack>

        <Stack spacing={40} alignItems="end" direction="row">
          <HStack alignItems="end" spacing={4}>
            <Box>
              <FormControl w="250px">
                <FormLabel sx={datePickLabel}>Auto Insurances Exp Date</FormLabel>
                <Input type="date" />
              </FormControl>
            </Box>

            <Box>
              <FormFileInput
                style={{
                  height: '40px',
                }}
                errorMessage={errors.autoInsurancesExpDate && errors.autoInsurancesExpDate?.message}
                label={''}
                name={`autoInsurancesExpDate`}
                register={register}
              >
                <Button
                  rounded="none"
                  roundedLeft={5}
                  fontSize="14px"
                  fontWeight={500}
                  color="gray.600"
                  bg="gray.100"
                  h="38px"
                  w={120}
                >
                  {t('chooseFile')}
                </Button>
              </FormFileInput>
            </Box>
          </HStack>
          <HStack>
            <Icon as={BiDownload} boxSize={4} color="#4E87F8" />
            <Text sx={downloadLabel}>Auto Insurance</Text>
          </HStack>
        </Stack>

        <Stack spacing={40} alignItems="end" direction="row">
          <HStack alignItems="end" spacing={4}>
            <Box>
              <FormControl w="250px">
                <FormLabel sx={datePickLabel}>COI GL Exp Date</FormLabel>
                <Input type="date" />
              </FormControl>
            </Box>

            <Box>
              <FormFileInput
                style={{
                  height: '40px',
                }}
                errorMessage={errors.coiGlExpDate && errors.coiGlExpDate?.message}
                label={''}
                name={`coiGlExpDate`}
                register={register}
              >
                <Button
                  rounded="none"
                  roundedLeft={5}
                  fontSize="14px"
                  fontWeight={500}
                  color="gray.600"
                  bg="gray.100"
                  h="38px"
                  w={120}
                >
                  {t('chooseFile')}
                </Button>
              </FormFileInput>
            </Box>
          </HStack>

          <HStack>
            <Icon as={BiDownload} boxSize={4} color="#4E87F8" />
            <Text sx={downloadLabel}>General Liability</Text>
          </HStack>
        </Stack>

        <Stack spacing={40} direction="row" alignItems="end">
          <HStack alignItems="end" spacing={4}>
            <Box>
              <FormControl w="250px">
                <FormLabel sx={datePickLabel}>COI WC Exp Date</FormLabel>
                <Input type="date" />
              </FormControl>
            </Box>

            <Box>
              <FormFileInput
                style={{
                  height: '40px',
                }}
                errorMessage={errors.coiWcExpDate && errors.coiWcExpDate?.message}
                label={''}
                name={`coiWcExpDate`}
                register={register}
              >
                <Button
                  rounded="none"
                  roundedLeft={5}
                  fontSize="14px"
                  fontWeight={500}
                  color="gray.600"
                  bg="gray.100"
                  h="38px"
                  w={120}
                >
                  {t('chooseFile')}
                </Button>
              </FormFileInput>
            </Box>
          </HStack>

          <HStack>
            <Icon as={BiDownload} boxSize={4} color="#4E87F8" />
            <Text sx={downloadLabel}>Work Comp</Text>
          </HStack>
        </Stack>
      </Stack>
    </form>
  )
}

export default Document
