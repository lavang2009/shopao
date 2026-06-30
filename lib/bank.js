export function getBankConfig() {
  return {
    bankName: process.env.NEXT_PUBLIC_BANK_NAME || "MB Bank",
    accountNumber: process.env.NEXT_PUBLIC_BANK_ACCOUNT || "0333096434",
    accountHolder: process.env.NEXT_PUBLIC_BANK_HOLDER || "Lầu A Vang",
    bankBin: process.env.NEXT_PUBLIC_BANK_BIN || "970422"
  };
}
export function vietqrUrl(amount, addInfo) {
  const bank = getBankConfig();
  const query = new URLSearchParams({
    amount: String(Math.max(0, Math.round(Number(amount || 0)))),
    addInfo: String(addInfo || ""),
    accountName: bank.accountHolder
  });
  return `https://img.vietqr.io/image/${bank.bankName.replace(/\s+/g, "")}-${bank.accountNumber}-compact2.png?${query.toString()}`;
}
