import { theme as chakraTheme } from '@chakra-ui/react'

const TableVariants = {
  Table: {
    variants: {
      simple: props => {
        return {
          // @ts-ignore
          ...chakraTheme.components.Table.variants.simple(props),
          table: {
            fontSize: '14px',
            whiteSpace: 'initial',
            fontStyle: 'normal',
            color: 'gray.600',
          },
          thead: {
            tr: {
              background: '#F7FAFC',
              fontWeight: 500,
              bg: 'gray.50',
              // h: '45px',
            },
          },
          tbody: {
            tr: {
              h: '45px',
              fontWeight: 400,
            },
            td: {
              borderColor: 'gray.300',
            },
          },
        }
      },
    },
  },
}

export default TableVariants
