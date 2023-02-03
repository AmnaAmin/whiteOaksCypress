import { render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Providers } from 'providers'
import { WORK_ORDERS, DOCUMENTS, SIGNATURE_IMG } from 'mocks/api/workorder/data'
import { waitForLoadingToFinish, screen, act } from 'utils/test-utils'
import { LienWaiverTab } from '../lien-waiver/lien-waiver'
import { Modal } from '@chakra-ui/react'
import { dateFormat } from 'utils/date-time-utils'
import { imgUtility } from 'utils/file-utils'

export const renderLienWaiver = async ({ onClose, workOrder, documentsData }: any) => {
  // mocking signature to image as canvas context as not supported in jest
  jest.spyOn(imgUtility, 'generateTextToImage').mockReturnValue(SIGNATURE_IMG)
  const component = await render(
    <Modal isOpen={true} onClose={onClose} size="none">
      <LienWaiverTab workOrder={workOrder} documentsData={documentsData} onClose={onClose} />
    </Modal>,
    {
      wrapper: Providers,
    },
  )

  await waitForLoadingToFinish()
  return component
}

jest.setTimeout(150000)

describe('Work Order Lien Waiver Test Cases', () => {
  test('User is able to view readonly info on lien waiver. User can enter claimants title & signature for the first time when lienwaiver has not been submitted', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.claimantName && !w.leanWaiverSubmitted && !w.dateLeanWaiverSubmitted)
    const documentsData = []

    await renderLienWaiver({ onClose, workOrder, documentsData })

    expect(screen.getByTestId('nameOfClaimant').textContent).toEqual(workOrder?.claimantName)
    expect(screen.getByTestId('makerOfCheck').textContent).toEqual(workOrder?.makerOfCheck)
    expect(screen.getByTestId('propertyAddress').textContent).toEqual(workOrder?.propertyAddress)
    expect(screen.getByTestId('amountOfCheck').textContent).toEqual('$' + workOrder?.finalInvoiceAmount)
    expect(screen.getByTestId('claimantsTitle')).not.toHaveAttribute('disabled')
    expect(screen.getByTestId('save-lien-waiver')).toBeInTheDocument()
    expect(screen.queryByTestId('recentLW')).not.toBeInTheDocument()

    // Enter Claimant Title
    userEvent.type(screen.getByTestId('claimantsTitle'), 'SSiddiqui')
    expect((screen.getByTestId('claimantsTitle') as HTMLInputElement).value).toEqual('SSiddiqui')

    // Open  Signature Modal
    await act(async () => await userEvent.click(screen.getByLabelText('open-signature')))
    expect(screen.getByTestId('signature-input')).toBeInTheDocument()

    // Enter  Signature
    userEvent.type(screen.getByTestId('signature-input'), 'Siddiqui')
    expect((screen.getByTestId('signature-input') as HTMLInputElement).value).toEqual('Siddiqui')

    // Click on Apply button
    await act(async () => await userEvent.click(screen.getByTestId('save-signature')))

    // Check Signature date rendered properly
    expect((screen.getByTestId('signature-date') as HTMLInputElement).value).toEqual(dateFormat(new Date()))

    // Save Lien Waiver and confirmation box shows
    await act(async () => await userEvent.click(screen.getByTestId('save-lien-waiver')))
    expect(screen.queryByTestId('confirmation-message')).toBeInTheDocument()

    // Confirm yes will start loading as api is called
    await act(async () => await userEvent.click(screen.getByTestId('confirmation-yes')))

    expect(screen.queryByText(/Loading/i)).toBeInTheDocument()
  })

  test('User is able to view readonly info in lien waiver. When Lien Waiver has been submitted claimant title and signature are readonly, Submitted LW link is there and save ', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.leanWaiverSubmitted && w.lienWaiverAccepted)
    const documentsData = DOCUMENTS
    await renderLienWaiver({ onClose, workOrder, documentsData })

    // Check all fields are diabled
    expect(screen.getByTestId('claimantsTitle')).toHaveAttribute('disabled')
    expect(screen.queryByTestId('openSignature')).not.toBeInTheDocument()
    expect(screen.queryByTestId('removeSignature')).not.toBeInTheDocument()
    expect(screen.getByTestId('recentLW')).toBeInTheDocument()
    // Check signature is displayed
    expect(screen.getByTestId('claimantsSignature')).toHaveAttribute(
      'src',
      DOCUMENTS.find(d => d.documentTypelabel === 'Lien Waiver Signature')?.s3Url,
    )
    // Check Lien Waiver link is present
    expect(screen.queryByTestId('save-lien-waiver')).not.toBeInTheDocument()
  })

  test('User is able to view readonly info in lien waiver. User can enter & save claimants title & signature again if LW has been rejected. An alert info regarding rejection is also displayed', async () => {
    const onClose = jest.fn()
    const workOrder = WORK_ORDERS.find(w => w.leanWaiverSubmitted && !w.lienWaiverAccepted)
    const documentsData = DOCUMENTS
    await renderLienWaiver({ onClose, workOrder, documentsData })

    // Check Alert Info is available
    expect(screen.getByTestId('lienWaiverRejectInfo')).toBeInTheDocument()

    // Check Claimant Title, Signature Fields and Save is enabled
    expect(screen.getByTestId('claimantsTitle')).not.toHaveAttribute('disabled')
    expect(screen.getByTestId('save-lien-waiver')).toBeInTheDocument()
    expect(screen.queryByTestId('recentLW')).not.toBeInTheDocument()

    // Enter Claimant Title
    userEvent.type(screen.getByTestId('claimantsTitle'), 'SSiddiqui')
    expect((screen.getByTestId('claimantsTitle') as HTMLInputElement).value).toEqual('SSiddiqui')

    // Enter Signature
    await act(async () => await userEvent.click(screen.getByLabelText('open-signature')))
    expect(screen.getByTestId('signature-input')).toBeInTheDocument()

    userEvent.type(screen.getByTestId('signature-input'), 'Siddiqui')
    expect((screen.getByTestId('signature-input') as HTMLInputElement).value).toEqual('Siddiqui')

    await act(async () => await userEvent.click(screen.getByTestId('save-signature')))

    // Check Signature date rendered properly
    expect((screen.getByTestId('signature-date') as HTMLInputElement).value).toEqual(dateFormat(new Date()))

    // Save Lien Waiver and confirmation box shows
    await act(async () => await userEvent.click(screen.getByTestId('save-lien-waiver')))
    expect(screen.queryByTestId('confirmation-message')).toBeInTheDocument()

    // Confirm yes will start loading as api is called
    await act(async () => await userEvent.click(screen.getByTestId('confirmation-yes')))
    expect(screen.queryByText(/Loading/i)).toBeInTheDocument()
  })
})
