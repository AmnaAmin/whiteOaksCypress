export const ACCOUNTS = 'accounts'

export const accounts = {
  en: {
    translation: {
      [ACCOUNTS]: {
        close: 'Close',
        batchSuccess: 'Batch Process has been completed successfully.',
        batchProcess: 'Batch processing',
        batch: 'Batch Process',
        processing: 'Processing...',
        accountReceivable: 'Account Receivable',
        accountPayable: 'Account Payable',
        batchUnSuccessFul: 'Batch Process cannot be completed',
        batchError: 'Batch Processing Failed',
        batchErrorMsg: 'Pending draw transactions exist against Project ID: ',
      },
    },
  },
  es: {
    translation: {
      [ACCOUNTS]: {
        // Project Management
        close: 'Cerca',
        batchSuccess: 'El proceso por lotes se completó con éxito.',
        batchProcess: 'Procesamiento por lotes',
        batch: 'Proceso por lotes',
        processing: 'Processing...',
        accountreceivable: 'Cuenta por cobrar',
        accountPayable: 'Cuenta por pagar',
        batchUnSuccessFul: 'No se puede completar el proceso por lotes',
        batchError: 'Procesamiento por lotes fallido',
        batchErrorMsg: 'Existen transacciones de sorteo pendientes contra el ID del proyecto: ',
      },
    },
  },
}
