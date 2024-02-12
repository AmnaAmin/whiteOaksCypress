import { render, screen, waitForLoadingToFinish } from 'utils/test-utils'
import { VendorProfileTabs } from '../vendor-profile'
import { Providers } from 'providers'
import { BrowserRouter } from 'react-router-dom'
import { VENDOR } from 'mocks/api/vendor-profile/data'

const onClose = jest.fn()

const renderVendorProfileModal = async () => {
    render(
        <BrowserRouter>
            <VendorProfileTabs vendorProfileData={VENDOR} vendorId={VENDOR.id} onClose={onClose} />
        </BrowserRouter>
        , { wrapper: Providers })

    await waitForLoadingToFinish()
}


describe("Vendor Tab Account Test Cases", () => {
    test('Should render Vendor Modal', async () => {
        await renderVendorProfileModal()
        screen.debug(undefined, 1000000000000000000000000000)
        // Unit test of tabs of vendor modal exists
        expect(screen.getByText("Details")).toBeInTheDocument()
        expect(screen.getByText("Documents")).toBeInTheDocument()
        expect(screen.getByText("License")).toBeInTheDocument()
        expect(screen.getByText("Skill")).toBeInTheDocument()
        expect(screen.getByText("Market")).toBeInTheDocument()
        expect(screen.getByText("Projects")).toBeInTheDocument()
        expect(screen.getByText("Users")).toBeInTheDocument()
        expect(screen.getByText("Messages")).toBeInTheDocument()
    })

})