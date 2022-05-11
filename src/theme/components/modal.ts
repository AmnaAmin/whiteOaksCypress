import { theme } from '@chakra-ui/theme'

const modalVariants = {
  Modal: {
    ...theme.components.Modal,
    variants: {
      custom: {
        header: {
          color: 'gray.600',
          fontWeight: '500',
          fontSize: '16px',
          px: '24px',
          py: '20px',
          borderBottom: '1px solid #eee',
        },
        dialog: {
          rounded: '0',
          borderTopWidth: '3px',
          borderStyle: 'solid',
          borderTopColor: 'brand.300',
        },
        body: {
          px: '24px',
          py: '15px',
        },
        footer: {
          px: '24px',
          py: '17px',
          borderTop: '1px solid #eee',
          gap: 3,
        },
        closeButton: {
          fontSize: '12px',
          color: 'gray.600',
          top: '4',
        },
      },
    },

    sizes: {
      '3xl': {
        dialog: { minWidth: '770px' },
      },
      '5xl': {
        dialog: { minWidth: '1050px' },
      },
    },
  },
}

export default modalVariants
