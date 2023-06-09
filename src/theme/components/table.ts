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
      'striped-list': props => {
        return {
          thead: {
            tr: {
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '18px',
              color: '#4A5568',
            },
            td: {
              borderBottom: '1px solid #CBD5E0 !important',
            },
          },

          tbody: {
            tr: {
              fontFamily: 'Poppins',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              color: 'gray.600',
              letterSpacing: '0.5px',
              _odd: {
                background: '#EDF2F7',
              },
            },
          },
        }
      },
    },
  },
}

export default TableVariants
