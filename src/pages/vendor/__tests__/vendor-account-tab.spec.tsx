import { render, screen, waitForLoadingToFinish } from 'utils/test-utils'
import App from 'App'
import { VendorProfileTabs } from '../vendor-profile'
import { Providers } from 'providers'
import { BrowserRouter } from 'react-router-dom'

const onClose = jest.fn()

const renderVendorProfileModal = async () => {
    render(
        <BrowserRouter>
            <VendorProfileTabs onClose={onClose} />
        </BrowserRouter>
        , { wrapper: Providers })

    await waitForLoadingToFinish()
}


describe("Vendor Tab Account Test Cases", () => {
    test('Should render Vendor Modal', async () => {
        await renderVendorProfileModal()
    })

})