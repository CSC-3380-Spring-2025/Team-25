"use client";

import React, {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  JSX,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/formatters"; // Import the formatter
import { ArrowLeft, Trash2 } from "lucide-react";

type BudgetSummary = {
  id: number;
  name: string;
  targetAmount: number;
  spent?: number;
};

type Tx = {
  id: number;
  amount: number;
  description: string | null;
  createdAt: string;
};

/* helper */
const apiFetch = async <T,>(
  url: string,
  init?: RequestInit,
): Promise<T> => {
  const r = await fetch(url, { credentials: "include", ...init });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
};

export default function BudgetTransactions(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [txs, setTxs] = useState<Tx[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: "", description: "" });
  const [error, setError] = useState<string | null>(null);

  /* initial load */
  useEffect(() => {
    refreshAll();
  }, [id]);

  const refreshAll = async () => {
    try {
      const [s, list] = await Promise.all([
        apiFetch<BudgetSummary>(`/api/budgets/${id}`),
        apiFetch<Tx[]>(`/api/budgets/${id}/transactions`),
      ]);
      setSummary(s);
      setTxs(list);
    } catch {
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  /* add transaction */
  const addTx = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.amount) return;
    try {
      await apiFetch(`/api/budgets/${id}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(form.amount),
          description: form.description,
        }),
      });
      setForm({ amount: "", description: "" });
      await refreshAll();
    } catch {
      setError("Create transaction failed");
    }
  };

  /* delete transaction */
  const deleteTx = async (txId: number) => {
    try {
      await apiFetch(`/api/budgets/${id}/transactions/${txId}`, {
        method: "DELETE",
      });
      setTxs((prev) => prev.filter((t) => t.id !== txId));
      setSummary((s) =>
        s ? { ...s, spent: (s.spent ?? 0) - txs.find((t) => t.id === txId)!.amount } : s,
      );
    } catch {
      setError("Delete failed");
    }
  };

  /* usage calc */
  const spent = summary?.spent ?? 0;
  const target = summary?.targetAmount ?? 1;
  const pct = Math.min(spent, target) / target;
  const barColor =
    pct >= 1 ? "bg-red-600" : pct >= 0.5 ? "bg-amber-500" : "bg-green-500";

  return (
    <div className="space-y-8 p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {loading ? (
        <p className="text-sm text-gray-500">Loading…</p>
      ) : error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : summary ? (
        <>
          {/* header */}
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold">{summary.name}</h1>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded">
              <div
                className={`h-full rounded ${barColor}`}
                style={{ width: `${Math.min(pct * 100, 100)}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {formatCurrency(spent)} spent of{" "}
              {formatCurrency(target)} ({(pct * 100).toFixed(0)} %)
            </p>
          </div>

          {/* add form */}
          <form onSubmit={addTx} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-sm mb-1">Amount ($)</label>
              <input
                type="number"
                value={form.amount}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, amount: e.target.value })
                }
                className="input input-bordered w-40 border-2"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <input
                type="text"
                value={form.description}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="input input-bordered w-64 border-2"
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Add
            </button>
          </form>

          {/* list */}
          {txs.length === 0 ? (
            <p className="text-sm text-gray-500">No transactions yet.</p>
          ) : (
            <ul className="space-y-2">
              {txs.map((t) => (
                <li
                  key={t.id}
                  className="border rounded p-3 flex justify-between items-center bg-white dark:bg-gray-800"
                >
                  <span>
                    {t.description ?? "(no description)"} —{" "}
                    {new Date(t.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-4">
                    <span>{formatCurrency(t.amount)}</span>
                    <button
                      onClick={() => deleteTx(t.id)}
                      className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      ) : null}
    </div>
  );
}
