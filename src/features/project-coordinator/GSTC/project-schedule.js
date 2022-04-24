import { Box, Flex } from '@chakra-ui/react'
// import './styles.css'
import GSTC from './GSTCWrapper'

export const ProjectSchedule = () => {
  let gstcState = undefined

  const config = {
    licenseKey:
      '====BEGIN LICENSE KEY====\nGb0nD/ZrInRpXEUTCgsdEk/+A3Im9/XKuXB51sWzf8gpcxmFnQOqyoHZg5g0fGmAmL42IHWlBmaoJPx0riMTpJ3cVDDmTX9SxhYQLr3XoKXyuG8/AZlvcksD6B4iHhDA+5JWOxKyZYTqUauElREWaSEZHZ61dMwP+RiBGgFjdXPL/+lllU4CyJ2xiBtkRKN1XL6k0k7jO6qdGDfG/94vBImnClUomlNZ3PIIkD5SpbrhbCvwhQNCvAx64ReGkrXmla+rjIWAgDonI25SGLCZVxmf4HwUfA/Ksyu0kGkON2ATTQOpD4mELND2I6Ahz+rUF/P1Ihcg0b6R3e8DqlUvtQ==||U2FsdGVkX1/NzVmcUFUecTIzAL1ZehSM2MTctoFN4xQ5ebJV5FkQz9kl5gIJu6+Usi5c1ERnRhwhqcxol5rWbVssSHjsCvfkqbFELKZQzJ0=\nYvzBQ8J3IHn4+6SI2W0bxlzWi1uAVO02H16Wu2nI/N2OHCk9IO9zh6hLSB9Y7SFv2nIPbMXT0CH2YBWnv0hbDIML6nRL/p9xZy9+flYdjJTOwehYrY2Zi9qcItyMbdliorjouqI6ch6PVRae9h88C5ONCzL2kl3buXsNoAziaZmQviRyydYwchrH3J7oS1sBY0YTpgyXABEescqVEgCoO587D/KV/7FImUcbOvehwAWPqsEp1GXEeW29MGOAnhcZsNgjEIZdxD21nhxYOp5VkI5vDHumIadDPWsYQlpjLAdxQUTjaplN4sLxr2us048YviFoLChrZj8JqakA/JPq2w==\n====END LICENSE KEY====',
    innerHeight: 200,
    list: {
      toggle: {
        display: false,
      },
      // fill rows data
      rows: {
        1: {
          id: '1',
          name: 'Row 1',
          trade: 'Trade 1',
          start: new Date().toISOString().slice(0, 10),
          end: new Date().toISOString().slice(0, 10),
        },
        2: {
          id: '2',
          name: 'Row 2',
          trade: 'Trade 2',
          start: new Date(),
          end: new Date(),
        },
        3: {
          id: '3',
          name: 'Row 3',
          trade: 'Trade 3',
          start: new Date(),
          end: new Date(),
        },
        4: {
          id: '4',
          name: 'Row 4',
          trade: 'Trade 4',
          start: new Date(),
          end: new Date(),
        },
      },
      // add columns
      columns: {
        data: {
          name: {
            id: 'name',
            data: 'name',
            width: 100,
            header: {
              content: 'Name',
            },
          },
          trade: {
            id: 'trade',
            data: 'trade',
            width: 100,
            header: {
              content: 'Trade',
            },
          },
          start: {
            id: 'start',
            data: 'start',
            width: 150,
            header: {
              content: 'Start',
            },
          },
          end: {
            id: 'end',
            data: 'end',
            width: 150,
            header: {
              content: 'End',
            },
          },
        },
      },
    },
    chart: {
      items: {
        1: {
          id: '1',
          rowId: '1',
          label: 'Item 1',
          time: {
            start: new Date().getTime(),
            end: new Date().getTime() + 24 * 60 * 60 * 1000,
          },
          style: { background: '#9AE6B4' },
        },
        2: {
          id: '2',
          rowId: '2',
          label: 'Item 2',
          time: {
            start: new Date().getTime() + 4 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 5 * 24 * 60 * 60 * 1000,
          },
          style: { background: '#F687B3' },
        },
        3: {
          id: '3',
          rowId: '2',
          label: 'Item 3',
          trade: 'Trade 3',
          time: {
            start: new Date().getTime() + 6 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
          },
          style: { background: '#90CDF4' },
        },
        4: {
          id: '4',
          rowId: '3',
          label: 'Item 4',
          time: {
            start: new Date().getTime() + 10 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 12 * 24 * 60 * 60 * 1000,
          },
          style: { background: '#FBD38D' },
        },
        5: {
          id: '5',
          rowId: '4',
          label: 'Item 5',
          time: {
            start: new Date().getTime() + 12 * 24 * 60 * 60 * 1000,
            end: new Date().getTime() + 14 * 24 * 60 * 60 * 1000,
          },
          style: { background: '#9AE6B4' },
        },
      },
    },
  }

  // this only works when you remove gstc.app.destroy(); from wrapper
  // const [sample, setSample] = React.useState(false)

  // // Trigger once
  // React.useEffect(() => {
  //   setSample(true)
  // }, [])

  function onState(state) {
    if (gstcState === undefined) {
      gstcState = state
    }
  }
  return (
    <>
      <Box fontWeight={500}>Project Schedule</Box>
      <Flex
        py={6}
        h="100%" //{{ base: 'unset', xl: '97px' }}
        w="100%"
        bg="white"
        borderRadius="4px"
        box-shadow="0px 20px 70px rgba(86, 89, 146, 0.1)"
      >
        <GSTC config={config} onState={onState} />
      </Flex>
    </>
  )
}
