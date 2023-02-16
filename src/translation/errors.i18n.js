export const ERROR = 'error'

export const globalErrors = {
  en: {
    translation: {
      [ERROR]: {
        'http.401': 'Un Authorized',
        alertBrowserWarningTitle: 'This browser is not supported.',
        alertBrowserWarning: 'Alerts notification service will not work in this browser.',
      },
    },
  },
  es: {
    translation: {
      [ERROR]: {
        'http.401': 'No autorizado',
        alertBrowserWarningTitle: 'Este navegador no es compatible',
        alertBrowserWarning: 'El servicio de notificación de alertas no funcionará en este navegador.',
      },
    },
  },
}
