import { ColumnDef } from '@tanstack/react-table'
import { dateFormat, datePickerFormat } from 'utils/date-time-utils'
import { StatusUserMgt } from './status-user-mgt'
import { USER_MANAGEMENT } from './user-management.i8n'
import { PAYMENT_MANAGEMENT } from './payment-management.i8n'
import { capitalize } from 'utils/string-formatters'
import { convertDateTimeToServerISO } from 'components/table/util'


//TODO - Move to constants file
export const BONUS = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 1,
    label: '1%',
  },
  {
    value: 2,
    label: '2%',
  },
  {
    value: 3,
    label: '3%',
  },
  {
    value: 4,
    label: '4%',
  },
  {
    value: 5,
    label: '5%',
  },
  {
    value: 6,
    label: '6%',
  },
  {
    value: 7,
    label: '7%',
  },
  {
    value: 8,
    label: '8%',
  },
  {
    value: 9,
    label: '9%',
  },
  {
    value: 10,
    label: '10%',
  },
]

//TODO - Move to constants file
export const DURATION = [
  {
    value: 0,
    label: 'No',
  },
  {
    value: 10,
    label: '10',
  },
  {
    value: 20,
    label: '20',
  },
  {
    value: 30,
    label: '30',
  },
  {
    value: 60,
    label: '60',
  },
  {
    value: 90,
    label: '90',
  },
  {
    value: -1,
    label: 'Indefinitely',
  },
]

export const USER_MGT_TABLE_QUERIES_KEY = {
  email: 'email.contains',
  firstName: 'firstName.contains',
  lastName: 'lastName.contains',
  authorities: 'authorities.contains',
  langKey: 'langKey.contains',
  activatedLabel: 'activatedLabel.contains',
  createdDateStart: 'createdDate.greaterThanOrEqual',
  createdDateEnd: 'createdDate.lessThanOrEqual',
  lastModifiedBy: 'lastModifiedBy.contains',
  lastModifiedDateStart: 'lastModifiedDate.greaterThanOrEqual',
  lastModifiedDateEnd: 'lastModifiedDate.lessThanOrEqual',
}

export const USER_MGT_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${USER_MANAGEMENT}.table.email`,
    accessorKey: 'email',
  },
  {
    header: `${USER_MANAGEMENT}.table.firstName`,
    accessorKey: 'firstName',
  },
  {
    header: `${USER_MANAGEMENT}.table.lastName`,
    accessorKey: 'lastName',
  },
  {
    header: `${USER_MANAGEMENT}.table.account`,
    accessorKey: 'authorities',
    accessorFn: row => {
      return capitalize(row?.authorities?.[0])
    },
  },
  {
    header: `${USER_MANAGEMENT}.table.language`,
    accessorKey: 'langKey',
  },
  {
    header: `${USER_MANAGEMENT}.table.status`,
    accessorKey: 'activatedLabel',
    accessorFn: row => {
      return row?.activated ? 'Activated' : 'Deactivate'
    },
    cell: (row: any) => {
      const value = row?.row.original?.activated
      return <StatusUserMgt id={value} />
    },
  },
  {
    header: `${USER_MANAGEMENT}.table.createdDate`,
    accessorKey: 'createdDate',
    accessorFn: (cellInfo: any) => {
      return datePickerFormat(cellInfo.createdDate)
    },
    cell: (row: any) => {
      const value = row?.row.original?.createdDate
      return dateFormat(value)
    },
    meta: { format: 'date' },
  },

  {
    header: `${USER_MANAGEMENT}.table.modifiedBy`,
    accessorKey: 'lastModifiedBy',
  },
  {
    header: `${USER_MANAGEMENT}.table.modifiedDate`,
    accessorKey: 'lastModifiedDate',
    accessorFn: (cellInfo: any) => datePickerFormat(cellInfo.lastModifiedDate),
    cell: (row: any) => {
      const value = row?.row.original?.lastModifiedDate
      return dateFormat(value)
    },
    meta: { format: 'date' },
  },
]

// 

export const PAYMENT_COLUMNS: ColumnDef<any>[] = [
  {
    header: `${PAYMENT_MANAGEMENT}.table.email`,
    accessorKey: 'billing_details.email',
  },
  {
    header: `${PAYMENT_MANAGEMENT}.table.firstName`,
    accessorKey: 'billing_details.name',
    id: "firstName",
    cell: (row: any) => {
      const name = row?.row.original?.billing_details?.name;
      let value = "_ _ _"
      if (name.includes(",")) {
        value = name?.split(",")[1];
      } else {
        value = name?.split(" ")[0];
      }
      return value ?? "_ _ _";
    }
  },
  {
    header: `${PAYMENT_MANAGEMENT}.table.lastName`,
    accessorKey: 'billing_details.name',
    id: "lastName",
    cell: (row: any) => {
      const name = row?.row.original?.billing_details?.name;
      let value = "_ _ _"
      if (name.includes(",")) {
        value = name?.split(",")[0];
      } else {
        value = name?.split(" ")[1];
      }
      return value ?? "_ _ _";
    }
  },
  {
    header: `${PAYMENT_MANAGEMENT}.table.type`,
    accessorKey: 'type',
    accessorFn: (row) => row?.type?.toUpperCase()
  },
  {
    header: `${PAYMENT_MANAGEMENT}.table.bankNameOrCardBrand`,
    id: 'bankNameOrCardBrand',
    accessorFn: (row) => {
      const card = row?.card;
      const bank = row?.us_bank_account;
      if (card) {
        return card?.brand?.toUpperCase() ?? "_ _ _";
      } else {
        return bank?.bank_name?.toUpperCase() ?? "_ _ _";
      }
    },
  },
  {
    header: `${PAYMENT_MANAGEMENT}.table.last4Digits`,
    id: 'last4Digits',
    accessorFn: (row: any) => {
      const card = row?.card;
      const bank = row?.us_bank_account;
      if (card) {
        return card?.last4 ?? "_ _ _";
      } else {
        return bank?.last4 ?? "_ _ _";
      }
    }
  },
  {
    header: `${PAYMENT_MANAGEMENT}.table.expiration`,
    id: 'expirationDate',
    accessorFn: (row: any) => {
      const card = row?.card;
      if (card) {
        const date = convertDateTimeToServerISO(new Date(card?.exp_year, card?.exp_month - 1))?.substring(0, 10);
        return date ?? "_ _ _";
      } else {
        return "_ _ _";
      }
    }
  }
]