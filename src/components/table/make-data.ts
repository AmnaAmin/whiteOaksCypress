// import { format } from 'date-fns';

import faker from "faker";

const range = (len: any) => {
  const arr: number[] = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

const newProject = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  const randomNumber = (range: number) => {
    return Math.round(Math.random() * range);
  };
  return {
    id: randomNumber(100),
    type: faker.company.companyName(),
    status: "Active",
    address: `${faker.address.countryCode()} ${faker.address.streetName()}`,
    region: faker.address.state(),
    pendingTransactions: randomNumber(20),
    pastDueWO: randomNumber(20),
    expectedPayDate: faker.date.past().toDateString(),
  };
};

export function projectData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => ({
      ...newProject(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}

const newTransaction = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  const randomNumber = (range: number) => {
    return Math.round(Math.random() * range);
  };
  return {
    id: randomNumber(100),
    type: faker.company.companyName(),
    status: "Active",
    trade: `${faker.name.jobTitle()}`,
    totalamount: faker.finance.amount(),
    submit: faker.date.past().toLocaleDateString(),
    approvedby: faker.internet.email(),
  };
};

export function TransactionData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => ({
      ...newTransaction(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}

const newProjectDocument = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  // const randomNumber = (range: number) => {
  //   return Math.round(Math.random() * range);
  // };
  return {
    document: "270 Laburnum",
    docType: "Work Order",
    fileType: "pdf",
    vendorGL: "ADT Renovations Inc",
    workOrder: "General Labor",
    createdBy: faker.date.past().toLocaleDateString(),
    createdDate: faker.date.past().toLocaleDateString(),
  };
};

export function projectDocumentData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => ({
      ...newProjectDocument(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}

const newWorkOrder = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  // const randomNumber = (range: number) => {
  //   return Math.round(Math.random() * range);
  // };
  return {
    status: "Active",
    trade: "Genral Labor",
    name: "ADT Renoations",
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber("0165#######"),
    issue: faker.date.past().toLocaleDateString(),
    expectedcompletion: faker.date.past().toLocaleDateString(),
    completed: faker.date.past().toLocaleDateString(),
  };
};

export function workOrderData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => ({
      ...newWorkOrder(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}

const newAlerts = () => {
  // const statusChance = Math.floor(Math.random() * 4);
  // const randomNumber = (range: number) => {
  //   return Math.round(Math.random() * range);
  // };
  return {
    name: "11 Joel CT",
    type: "Project",
    value: "Project Manager",
    category: "Info",
    dateTriggered: faker.date.past().toLocaleDateString(),
  };
};

export function alertsData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => ({
      ...newAlerts(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}

const newProjectColumn = () => {
  const randomNumber = (range: number) => {
    return Math.round(Math.random() * range);
  };

  return {
    id: randomNumber(100),
    flex: null,
    hide: false,
    sort: null,
    sortIndex: null,
    colId: faker.name.findName(),
    aggFunc: null,
    pivot: false,
    pivotIndex: null,
    pinned: null,
    rowGroup: false,
    rowGroupIndex: null,
    type: "project",
    field: faker.name.findName(),
    cellRenderer: "dateRenderer",
    contentKey: faker.name.findName(),
    order: 1,
    minWidth: 120,
    userId: randomNumber(100),
  };
};

export function projectColumnData(...lens: any) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => ({
      ...newProjectColumn(),
      subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
    }));
  };

  return makeDataLevel();
}
