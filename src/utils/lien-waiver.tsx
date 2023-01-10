import { Box, Text } from '@chakra-ui/react'
import { t } from 'i18next'
import { dateFormat } from './date-time-utils'
import { useTranslation } from 'react-i18next'

const noticeText = () => {
  return t('noticeText')
}

const informationSection = () => {
  return t('informationSection')
}

const identifyingInformation = {
  claimantName: 'Claimant Name',
  customerName: 'Customer Name',
  propertyAddress: 'Job Location',
  owner: 'Owner',
}

const checkInformation = {
  makerOfCheck: 'Maker of check',
  amountOfCheck: 'Amount of Check',
  checkPayableTo: 'Check Payable To',
}

const exceptions = {
  affectees: 'This document does not affect any of the following',
  disputedClaims: 'Disputed claims for extras in the amount of: $',
}

const signature = {
  claimantTitle: 'Claimant`s title',
}

const dateOfSignature = 'Date of Signature'
const claimantsSignature = 'Claimant`s Signature'

export const GetHelpText = () => {
  const { t } = useTranslation()

  return (
    <Box>
      <Text fontSize="14px" fontWeight={500} color="#2D3748">
        {t('firstHeading')}
        {/* {headings.first} */}
      </Text>
      <br />
      <Text fontSize="14px" fontWeight="400" color="gray.500" flexWrap="wrap">
        {noticeText()}
      </Text>
      <br />
      <Text fontSize="14px" fontWeight={500} color="#2D3748">
        {t('thirdHeading')}
      </Text>
      <br />
      <Text fontSize="14px" fontWeight="400" color="gray.500" flexWrap="wrap">
        {informationSection()}
      </Text>
    </Box>
  )
}

export const createForm = (form, values, signatureDimention, imageUrl) => {
  const headings = {
    first: t('firstHeading'),
    second: t('secondHeading'),
    third: t('thirdHeading'),
    fourth: t('fourthHeading'),
    fifth: t('fifthHeading'),
  }
  // main heading
  form.setFontSize(12)
  form.setFont(undefined, 'bold')
  const xHeading1 = (form?.internal?.pageSize?.getWidth() - form?.getTextWidth(headings?.first)) / 2
  form.text(headings.first, xHeading1, 20)

  // notice;
  const notice = form.splitTextToSize(noticeText(), 200)
  form.setFontSize(10)
  form.text(notice, 20, 30)
  form.line(20, 45, 200, 45)

  // identifying information
  const xHeading2 = (form.internal.pageSize.getWidth() - form.getTextWidth(headings.second)) / 2
  form.text(headings.second, xHeading2, 50)

  // identifying fields
  form.setFont(undefined, 'normal')
  let y = 55
  for (const [key, value] of Object.entries(identifyingInformation)) {
    y = y + 5
    form.text(`${value}: ${values[key] ? values[key] : ''}`, 20, y)
  }
  form.line(20, 80, 200, 80)

  // conditional waiver and release
  form.setFont(undefined, 'bold')
  const xHeading3 = (form.internal.pageSize.getWidth() - form.getTextWidth(headings.third)) / 2
  form.text(headings.third, xHeading3, 85)

  // general information
  const information = form.splitTextToSize(informationSection(), 170)
  form.setFont(undefined, 'normal')
  form.text(information, 20, 95)

  // check fields
  let m = 125
  for (const [key, value] of Object.entries(checkInformation)) {
    m = m + 5
    form.text(`${value}: ${values[key] ? values[key] : ''}`, 20, m)
  }
  form.line(20, 145, 200, 145)

  // // exceptions
  const xHeading4 = (form.internal.pageSize.getWidth() - form.getTextWidth(headings.fourth)) / 2
  form.setFont(undefined, 'bold')
  form.text(headings.fourth, xHeading4, 150)

  // exception fields
  form.setFont(undefined, 'normal')
  let n = 155
  for (const [key, value] of Object.entries(exceptions)) {
    n = n + 5
    form.text(`${value}: ${values[key] ? values[key] : ''}`, 20, n)
  }
  form.line(20, 170, 200, 170)

  // Signature
  const xHeading5 = (form.internal.pageSize.getWidth() - form.getTextWidth(headings.fifth)) / 2
  form.setFont(undefined, 'bold')
  form.text(headings.fifth, xHeading5, 175)

  // signature fields
  form.setFont(undefined, 'normal')
  let o = 180
  form.text(`${claimantsSignature}:`, 20, o)
  form.addImage(imageUrl, 'png', 56, o - 2.4, signatureDimention.width / 4, signatureDimention.height / 4)

  for (const [key, value] of Object.entries(signature)) {
    o = o + 5
    form.text(`${value}: ${values[key] ? values[key] : ''}`, 20, o)
  }
  o = o + 5

  form.text(`${dateOfSignature}: ${values.dateOfSignature ? dateFormat(values.dateOfSignature) : ''}`, 20, o)

  return form
}
