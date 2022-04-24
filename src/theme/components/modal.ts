import { theme } from '@chakra-ui/theme'

const modalVariants = {
  Modal: {
    ...theme.components.Modal,
    sizes: { xlg: { Content: { minWidth: '42rem' } } },
  },
}

export default modalVariants
