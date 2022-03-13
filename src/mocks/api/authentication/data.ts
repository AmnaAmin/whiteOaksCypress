export const ACCOUNT = {
  id: 57,
  login: "vendor@devtek.ai",
  firstName: "Vendor",
  lastName: "DevTek",
  email: "vendor@devtek.ai",
  imageUrl: null,
  activated: true,
  langKey: "en",
  createdBy: "admin@woa.com",
  createdDate: "2021-09-12T12:56:31Z",
  lastModifiedBy: "vendor@devtek.ai",
  lastModifiedDate: "2022-01-14T23:12:30Z",
  authorities: ["ROLE_USER"],
  streetAddress: "DevTek Inc",
  city: "",
  stateId: null,
  zipCode: "",
  telephoneNumber: "(123)-123-1234",
  status: null,
  userType: 6,
  userTypeLabel: "Vendor",
  employeeId: "",
  vendorId: 4,
  newPassword: null,
  firebaseToken: null,
  fieldProjectManagerRoleId: null,
  parentFieldProjectManagerId: null,
  telephoneNumberExtension: "",
  reportingFieldManagers: null,
  markets: null,
  newTarget: null,
  newBonus: null,
  ignoreQuota: null,
  removeCards: null,
  avatar: null,
  avatarName: null,
  features: ["Alerting"],
  hfeWage: null,
  deleted: false,
};

export function makeToken(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
