export const ERROR_MESSAGES = {
  insufficientFunds: "Not enough funds to proceed with the transaction.",
  gasFeeError: "Insufficient funds to cover the gas fee.",
  lowTokenBalance: "You do not have enough tokens to complete this deposit.",
  transactionRejected: "Transaction was rejected by the user.",
  walletRequest: "Please verify the pending request in your wallet.",
  internalError: "An internal error occurred. Try again later.",
  contractError: "Smart contract reverted the transaction.",
  notConnected: "Please connect your wallet.",
  zeroAmount: "Please enter a valid, non-zero amount.",
  allowanceError: "Please approve the token before depositing.",
};

export function getErrorMessage(error: any): string {
  if (!error) return ERROR_MESSAGES.internalError;
  if (error.code === "INSUFFICIENT_FUNDS") return ERROR_MESSAGES.insufficientFunds;
  if (
    error.message?.toLowerCase().includes("user rejected") ||
    error.code === 4001
  )
    return ERROR_MESSAGES.transactionRejected;
  if (error.message?.toLowerCase().includes("gas")) return ERROR_MESSAGES.gasFeeError;
  if (error.message?.toLowerCase().includes("insufficient")) return ERROR_MESSAGES.lowTokenBalance;
  if (error.reason) return error.reason;
  if (error.data?.message) return error.data.message;
  if (error.message) return error.message;
  return ERROR_MESSAGES.internalError;
}
