export const ACCOUNT_VENDOR = {
  id: 57,
  login: 'vendor@devtek.ai',
  firstName: 'Vendor',
  lastName: 'DevTek',
  email: 'vendor@devtek.ai',
  imageUrl: null,
  activated: true,
  langKey: 'en',
  createdBy: 'admin@woa.com',
  createdDate: '2021-09-12T12:56:31Z',
  lastModifiedBy: 'vendor@devtek.ai',
  lastModifiedDate: '2022-01-14T23:12:30Z',
  authorities: ['ROLE_USER'],
  streetAddress: 'DevTek Inc',
  city: '',
  stateId: null,
  zipCode: '',
  telephoneNumber: '(123)-123-1234',
  status: null,
  userType: 6,
  userTypeLabel: 'Vendor',
  employeeId: '',
  vendorId: 4,
  newPassword: null,
  firebaseToken: null,
  fieldProjectManagerRoleId: null,
  parentFieldProjectManagerId: null,
  telephoneNumberExtension: '',
  reportingFieldManagers: null,
  markets: null,
  newTarget: null,
  newBonus: null,
  ignoreQuota: null,
  removeCards: null,
  avatar: null,
  avatarName: null,
  features: ['Alerting'],
  hfeWage: null,
  deleted: false,
}

export const ACCOUNT_PC = {
  id: 112,
  login: 'pc@woa.com',
  firstName: 'PC',
  lastName: 'DevTek',
  email: 'pc@woa.com',
  imageUrl: null,
  activated: true,
  langKey: null,
  createdBy: 'admin@devtek.ai',
  createdDate: '2022-05-10T10:40:39Z',
  lastModifiedBy: 'pc@woa.com',
  lastModifiedDate: '2022-06-17T16:56:44Z',
  authorities: ['ROLE_USER'],
  streetAddress: 'abc 23',
  city: '',
  stateId: null,
  zipCode: '',
  telephoneNumber: '(333)-333-3333',
  status: null,
  userType: 112,
  userTypeLabel: 'Project Coordinator',
  employeeId: '',
  vendorId: null,
  newPassword: null,
  firebaseToken: null,
  fieldProjectManagerRoleId: null,
  parentFieldProjectManagerId: null,
  telephoneNumberExtension: '',
  reportingFieldManagers: null,
  markets: null,
  newTarget: null,
  newBonus: null,
  ignoreQuota: null,
  removeCards: null,
  avatar: null,
  avatarName: null,
  features: ['Alerting'],
  hfeWage: null,
}

export function getUserData(token: string) {
  if (token === 'Bearer vendor') {
    return ACCOUNT_VENDOR
  }

  if (token === 'Bearer pc') {
    return ACCOUNT_PC
  }
}

export function makeToken(length) {
  var result = ''
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  var charactersLength = characters.length
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}
