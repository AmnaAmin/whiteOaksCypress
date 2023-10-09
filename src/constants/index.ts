export const PAYMENT_TERMS_OPTIONS = [
  {
    value: 7,
    label: '7',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 14,
    label: '14',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
]

export const FILTERED_PAYMENT_TERMS_OPTIONS = PAYMENT_TERMS_OPTIONS.filter(payment => [20, 30].includes(payment.value))

export const CANCEL_WO_OPTIONS = [
 
  {
    value: 35,
    label: 'Yes',
  },
]
