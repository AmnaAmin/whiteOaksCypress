import { theme as chakraTheme } from '@chakra-ui/react'

const TableVariants = {
  Table: {
    variants: {
      simple: props => {
        return {
          // @ts-ignore
          ...chakraTheme.components.Table.variants.simple(props),
          fontSize: '14px',
          color: 'gray.600',
          whiteSpace: 'initial',
          border: '1px solid #E2E8F0',
          fontStyle: 'normal',
          thead: {
            tr: {
              background: '#F7FAFC',
              fontWeight: 500,
              fontSize: '14px',
              bg: 'gray.50',
              color: 'gray.600',
              h: '72px',
            },
          },
          tbody: {
            tr: {
              h: '72px',
              bg: 'white',
              fontSize: '14px',
              fontWeight: 400,
              color: 'gray.600',
            },
          },
        }
      },
    },
  },
}

export default TableVariants
