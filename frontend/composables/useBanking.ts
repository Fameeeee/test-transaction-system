type Tx = {
  id: number;
  type: "deposit" | "withdraw";
  amount: number;
  created_at: string;
};

export function useBanking() {
  const { request } = useApi();
  const balance = useState<number>("bank:balance", () => 0);
  const transactions = useState<Tx[]>("bank:transactions", () => []);

  async function fetchBalance() {
    const r = await request<{ balance: number }>("/banking/balance");
    balance.value = r.balance;
    return r.balance;
  }

  async function fetchTransactions() {
    const r = await request<{ transactions: Tx[]; balance: number }>(
      "/banking/transactions"
    );
    transactions.value = r.transactions;
    balance.value = r.balance;
    return transactions.value;
  }

  async function createTransaction(
    type: "deposit" | "withdraw",
    amount: number
  ) {
    const r = await request<{ transaction: Tx; balance: number }>(
      "/banking/transactions",
      {
        method: "POST",
        body: JSON.stringify({ type, amount }),
      }
    );
    balance.value = r.balance;
    transactions.value = [r.transaction, ...transactions.value];
    return r.transaction;
  }

  async function updateTransaction(id: number, amount: number) {
    const r = await request<{ transaction: Tx; balance: number }>(
      `/banking/transactions/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ amount }),
      }
    );
    balance.value = r.balance;
    transactions.value = transactions.value.map((t) =>
      t.id === id ? r.transaction : t
    );
    return r.transaction;
  }

  async function deleteTransaction(id: number) {
    const r = await request<{ ok: boolean; balance: number }>(
      `/banking/transactions/${id}`,
      { method: "DELETE" }
    );
    balance.value = r.balance;
    transactions.value = transactions.value.filter((t) => t.id !== id);
    return r.ok;
  }

  return {
    balance,
    transactions,
    fetchBalance,
    fetchTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
  };
}
