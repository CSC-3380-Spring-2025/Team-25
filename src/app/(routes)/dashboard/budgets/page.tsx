/* ---------------------------------------------------------------------
 *  Budgets page with Delete‑budget button
 * -------------------------------------------------------------------*/
"use client";

import React, {
  useState,
  useEffect,
  FormEvent,
  ChangeEvent,
  JSX,
} from "react";
import Link from "next/link";
import { Plus, Users, Trash2 } from "lucide-react";
import { useAuth, SignInButton } from "@clerk/nextjs";
import ShareButton from "./_components/ShareButton";

export interface BudgetRow {
  id: number;
  name: string;
  targetAmount: number;
  spent?: number;
  members?: string[];
}

async function apiFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, { credentials: "include", ...init });
  if (!r.ok) throw new Error(`${r.status}`);
  return r.json();
}

export default function BudgetsPage(): JSX.Element {
  const { isLoaded, isSignedIn } = useAuth();

  const [budgets, setBudgets] = useState<BudgetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", target: "" });
  const [error, setError] = useState<string | null>(null);

  const loadBudgets = () =>
    apiFetch<BudgetRow[]>("/api/budgets")
      .then((rows) =>
        setBudgets(rows.map((r) => ({ ...r, members: r.members ?? [] }))),
      )
      .catch(() => setError("Failed to load budgets"))
      .finally(() => setLoading(false));

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      setLoading(true);
      loadBudgets();
    }
  }, [isLoaded, isSignedIn]);

  /* create */
  const addBudget = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.target) return;
    try {
      await apiFetch("/api/budgets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          target: parseFloat(form.target),
        }),
      });
      setForm({ name: "", target: "" });
      loadBudgets();
    } catch {
      setError("Create failed");
    }
  };

  /* delete */
  const deleteBudget = async (id: number) => {
    try {
      await apiFetch(`/api/budgets/${id}`, { method: "DELETE" });
      setBudgets((prev) => prev.filter((b) => b.id !== id));
    } catch {
      setError("Delete failed (are you the owner?)");
    }
  };

  /* -------------------------------- render ------------------------------ */
  if (!isLoaded) return <p className="mt-6 text-sm">Loading…</p>;
  if (!isSignedIn)
    return (
      <div className="mt-6 space-y-4">
        <p className="text-sm text-gray-500">Sign in to manage budgets.</p>
        
      </div>
    );

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-semibold flex items-center gap-2">
        <Users className="w-6 h-6" /> Budgets
      </h2>

      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* create form */}
      <form onSubmit={addBudget} className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm mb-1">Budget Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, name: e.target.value })
            }
            className="input input-bordered w-64 border-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Target Amount ($)</label>
          <input
            type="number"
            value={form.target}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setForm({ ...form, target: e.target.value })
            }
            className="input input-bordered w-40 border-2"
            min="0"
            step="0.01"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create
        </button>
      </form>

      {/* list */}
      {loading ? (
        <p className="text-sm text-gray-500 mt-6">Loading budgets…</p>
      ) : budgets.length === 0 ? (
        <p className="text-sm text-gray-500 mt-6">
          No budgets yet. Create one above.
        </p>
      ) : (
        <ul className="space-y-4">
          {budgets.map((b) => (
            <li key={b.id} className="border rounded-lg bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between p-4">
                <Link
                  href={`/dashboard/budgets/${b.id}`}
                  className="flex-1 hover:underline"
                >
                  <p className="font-medium">{b.name}</p>
                  <p className="text-sm text-gray-500">
                    ${b.targetAmount.toLocaleString()} target · {b.members?.length ?? 0}{" "}
                    member{(b.members?.length ?? 0) !== 1 && "s"}
                  </p>
                </Link>

                {/* share + delete */}
                <div className="flex items-center gap-3">
                  
                  <button
                    onClick={() => deleteBudget(b.id)}
                    aria-label="Delete budget"
                    className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-5 w-5 text-red-600" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
