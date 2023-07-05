import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

i18n.use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        details: 'Details',
        documents: 'Documents',
        trade: 'Skill',
        market: 'Market',
        businessName: 'Business Name',
        capacity: 'Capacity',
        last4digits: 'Last 4 digits of the SSN /TIN',
        paymentMethods: 'Payment Methods',
        streetAddress: 'Street Address',
        state: 'State',
        city: 'City',
        zip: 'Zip',
        primaryContact: 'Primary Contact',
        secondaryContact: 'Secondary Contact',
        businessPhoneNo: 'Business Phone No',
        ext: 'Ext',
        secondaryNo: 'Secondary No',
        primaryEmail: 'Primary Email',
        secondaryEmail: 'Secondary Email',
      },
    },
    es: {
      translation: {
        details: 'Details 2',
        documents: 'Documents 2',
        trade: 'Skill 2',
        market: 'Market 2',
        businessName: 'Business Name 2',
        capacity: 'Capacity 2',
        last4digits: 'Last 4 digits of the SSN /TIN 2',
        paymentMethods: 'Payment Methods 2',
        streetAddress: 'Street Address 2',
        state: 'State 2',
        city: 'City 2',
        zip: 'Zip 2',
        primaryContact: 'Primary Contact 2',
        secondaryContact: 'Secondary Contact 2',
        businessPhoneName: 'Business Phone Name 2',
        ext: 'Ext 2',
        secondaryNo: 'Secondary No 2',
        primaryEmail: 'Primary Email 2',
        secondaryEmail: 'Secondary Email 2',
      },
    },
  },
  lng: 'en',
  fallbackLng: 'en',
  react: {
    useSuspense: false,
  },
})

export default i18n
