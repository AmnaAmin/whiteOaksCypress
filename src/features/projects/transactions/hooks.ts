import { TransactionTypeValues } from "types/transaction.type";
import { AGAINST_DEFAULT_VALUE } from "utils/transactions";
import { useWatch } from "react-hook-form";

export const useFieldShowHideDecision = (control) => {
  const transactionType = useWatch({ name: "transactionType", control });
  const against = useWatch({ name: "against", control });
  const selectedTransactionTypeId = transactionType?.value;
  const selectedAgainstId = against?.value;

  const isTransactionTypeDefaultOptionSelected =
    selectedTransactionTypeId &&
    selectedTransactionTypeId === TransactionTypeValues.changeOrder;
  const isAgainstWorkOrderOptionSelected =
    selectedAgainstId && selectedAgainstId !== AGAINST_DEFAULT_VALUE;
  const isAgainstProjectSOWOptionSelected =
    selectedAgainstId && selectedAgainstId === AGAINST_DEFAULT_VALUE;

  return {
    isShowWorkOrderSelectField: isAgainstProjectSOWOptionSelected,
    isShowChangeOrderSelectField: isAgainstProjectSOWOptionSelected,
    isShowExpectedCompletionDateField:
      isAgainstWorkOrderOptionSelected &&
      isTransactionTypeDefaultOptionSelected,
    isShowNewExpectedCompletionDateField:
      isAgainstWorkOrderOptionSelected &&
      isTransactionTypeDefaultOptionSelected,
  };
};

export const useTotalAmount = (control) => {
  const transaction = useWatch({ name: "transaction", control });
  const totalAmount = transaction?.reduce((result, transaction) => {
    if (transaction.amount) {
      return result + Number(transaction.amount);
    } else {
      return result;
    }
  }, 0);

  if (totalAmount < 0) return `-$${Math.abs(totalAmount)}`;

  return `$${totalAmount}`;
};
