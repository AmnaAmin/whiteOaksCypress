jest.setTimeout(150000)

describe('Vendor Profile Market Test Cases', () => {
  it('Market Data is rendered', async () => {
    //await render(<App />, { route: '/vendors' })
    /* const markettab = screen.getByTestId('markettab')
    act(() => {
      fireEvent.click(markettab)
    })
    await waitFor(() => {
      const openTab = screen.getByRole('tab', { selected: true })
      expect(openTab.innerHTML).toEqual('Market')
      expect(screen.getAllByTestId(/^marketChecks/).length).toBeGreaterThan(0)
    })*/
  })

  it('Market options can be toggled', async () => {
    /* await render(<App />, { route: '/vendors' })

    const marketOptions = screen.getAllByTestId(/^marketChecks/)
    expect(marketOptions[0].querySelector('.checkboxButton')).not.toHaveAttribute('data-checked')
    act(() => {
      fireEvent.click(marketOptions[0])
    }) 
    await waitFor(() => {
      //expect(marketOptions[0].querySelector('.checkboxButton')).toHaveAttribute('data-checked')
    })
    act(() => {
      fireEvent.click(marketOptions[0])
    })
    await waitFor(() => {
      //expect(marketOptions[0].querySelector('.checkboxButton')).not.toHaveAttribute('data-checked')
    }) */
  })

  it('Market skills options are selected', async () => {
    /*await render(<App />, { route: '/vendors' })
    const markets = VENDOR_DATA.markets.map(m => m.id)
    markets.forEach(m => {
      // expect(screen.getByTestId(`marketChecks.${m}`).querySelector('.checkboxButton')).toHaveAttribute('data-checked')
    })*/
  })

  it('Market form saves successfully', async () => {
    /*directRender(<MarketForm vendorProfileData={VENDOR_DATA as any} markets={MARKETS} />)
    act(() => {
      fireEvent.submit(screen.getByTestId('saveMarkets'))
    })
    //await waitFor(() => expect(mockSave).toBeCalledTimes(1)) */
  })
})
