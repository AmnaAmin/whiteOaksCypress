import { VStack, Text, Box, Button, Center, Spinner } from '@chakra-ui/react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useEffect, useState } from 'react'

const qrcodeRegionId = 'html5qr-code-full-region'

interface Location {
  latitude: number
  longitude: number
}

interface QRCodeResult {
  id: number
  lng: number
  lat: number
}

const createConfig = (props: any) => {
  let config = {
    videoConstraints: {
      facingMode: { exact: 'environment' },
    },
  } as any
  if (props.fps) {
    config.fps = props.fps
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip
  }
  return config
}

const Html5QrcodePlugin = props => {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props)
    const verbose = props.verbose === true
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw Error('qrCodeSuccessCallback is required callback.')
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(qrcodeRegionId, config, verbose)
    html5QrcodeScanner.render(props.qrCodeSuccessCallback, props.qrCodeErrorCallback)

    // cleanup function when component will unmount
    return () => {
      html5QrcodeScanner.clear().catch(error => {
        console.error('Failed to clear html5QrcodeScanner. ', error)
      })
    }
  }, [])

  return <div id={qrcodeRegionId} style={{ width: '600px' }} />
}

export default function GeoQRScan() {
  const [hasScanned, setHasScanned] = useState(false)
  const [qrCodeResult, setQrCodeResult] = useState<QRCodeResult | undefined>(undefined)
  console.log('🚀 ~ file: geo-qr-scan.tsx:56 ~ GeoQRScan ~ qrCodeResult:', qrCodeResult)

  const onNewScanResult = (decodedText, decodedResult) => {
    // const base64encodedJson = "eyJpZCI6IDEyMzQ1NiwgbG5nOiAxMzEuMTEsIGxhdDogMzMzLjExfQ=="
    try {
      const decodeBase64 = atob(decodedResult.result.text)
      try {
        const jsonParsed = JSON.parse(decodeBase64)
        const result = {
          id: jsonParsed.id,
          lng: jsonParsed.lng,
          lat: jsonParsed.lat,
        }
        setQrCodeResult(result)
        setHasScanned(true)
        console.log(decodeBase64)
      } catch (error) {
        console.error(error)
        throw new Error('QR scanning completed, but unable to extract code. Invalid input')
      }
    } catch (error) {
      console.error(error)
      throw Error('Invalid or Un-supported QR Code provided.')
    }
  }

  const onScanFailure = (error: any) => {
    console.log('scan error: ', error)
  }

  const handleScanAgain = () => {
    setHasScanned(false)
    setQrCodeResult(undefined)
  }

  useEffect(() => {
    //remove qr code branding
    const elements = document.querySelectorAll('[alt="Info icon"]')

    elements.forEach(function (element) {
      element.remove()
    })
  }, [])
  return (
    <Center>
      <VStack h="50vh" alignItems="center" justifyContent="center">
        {!hasScanned ? (
          <Box w="100%">
            <Box>
              <Text>Scan QR Code</Text>
            </Box>

            <Box>
              <Html5QrcodePlugin
                fps={10}
                qrbox={300}
                disableFlip={false}
                qrCodeSuccessCallback={onNewScanResult}
                qrCodeErrorCallback={onScanFailure}
              />
            </Box>
          </Box>
        ) : (
          <Box w="100%">
            <Box>
              <Text>QR Code Scanning Results Found.</Text>
              <Text>ID: {qrCodeResult?.id}</Text>
              <Text>Longitude: {qrCodeResult?.lng}</Text>
              <Text>Latitude: {qrCodeResult?.lat}</Text>
            </Box>

            <Box mt="25px">
              <Text>Your Location Data.</Text>
              <LocationComponent />
            </Box>
            <Box mt="25px">
              <Button onClick={handleScanAgain} colorScheme="brand">
                Scan QR Code
              </Button>
            </Box>
          </Box>
        )}
      </VStack>
    </Center>
  )
}

const LocationComponent: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          setLocation({ latitude, longitude })
        },
        err => {
          setError(err.message)
        },
      )
    } else {
      setError('Geolocation is not supported by your browser')
    }
  }

  useEffect(() => {
    getLocation()
    return () => {
      setLocation(null)
    }
  }, [])

  return (
    <Box>
      {location ? (
        <Box>
          <Text>Latitude: {location.latitude}</Text>
          <Text>Longitude: {location.longitude}</Text>
        </Box>
      ) : (
        <Spinner />
      )}
      {error && <Text color="red">Error: {error}</Text>}
    </Box>
  )
}
