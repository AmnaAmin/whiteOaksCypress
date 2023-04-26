import { Box, Alert, AlertIcon, AlertDescription, HStack, FormLabel, CloseButton } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

interface AlertProps {
  onClose?: () => void
  msg: string
  styleBox?: any
}

export const AlertError: React.FC<AlertProps> = ({ msg, onClose, styleBox }) => {
  const { t } = useTranslation()

  return (
    <Box
      width={{
        sm: '100%',
        md: '70%',
        lg: '70%',
      }}
      marginTop={{ base: '4px', sm: '30px', md: 0, xl: 0, lg: 0 }}
      {...styleBox}
    >
      <Alert
        status="error"
        rounded={6}
        bg="#FFE4E4"
        pr={1}
        mb={3}
        mr={4}
        h={{ sm: 'auto', md: '47px', xl: '47px', lg: '47px' }}
      >
        <AlertIcon />
        <AlertDescription display="flex" justifyContent="space-between" w="100%">
          <HStack>
            <FormLabel
              variant="strong-label"
              m={0}
              color="#F56565"
              fontSize={{ base: '12px', sm: '14px', lg: '16px' }}
              lineHeight="20px"
            >
              {t(`${msg}`)}
            </FormLabel>
          </HStack>
          {!!onClose && <CloseButton onClick={onClose} m={3} />}
        </AlertDescription>
      </Alert>
    </Box>
  )
}
