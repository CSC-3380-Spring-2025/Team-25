/* -----------------------------------------------------------------
 *  ShareButton component
 * ----------------------------------------------------------------*/
"use client";

import React, { useState, ChangeEvent } from "react";
import { UserPlus2, X } from "lucide-react";

/* ---------- local types ---------- */
export type BudgetLite = {
  id: number;
  name: string;
};

type Props = {
  budget: BudgetLite;
  /** callback so parent <BudgetsPage> can reflect new members instantly */
  onShare: (budgetId: number, newMemberIds: string[]) => void;
};

/* ---------- component ---------- */
export default function ShareButton({ budget, onShare }: Props) {
  /* early guard – never crash if accidentally rendered with undefined */
  if (!budget) return null;

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");   // comma‑separated user‑ids
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* submit IDs */
  const submit = async () => {
    const ids = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!ids.length) return;

    setBusy(true);
    setError(null);

    try {
      await Promise.all(
        ids.map((inviteeId) =>
          fetch(`/api/budgets/${budget.id}/invite`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              inviteeId: Number(inviteeId),
              role: "viewer",
            }),
          }).then((r) => {
            if (!r.ok) throw new Error(`${r.status}`);
          }),
        ),
      );

      /* optimistic UI update in parent */
      onShare(budget.id, ids);
      setOpen(false);
      setValue("");
    } catch {
      setError("Invite failed. Check the IDs and try again.");
    } finally {
      setBusy(false);
    }
  };

  /* ---------- render ---------- */
  return (
    <>
      {/* trigger */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <UserPlus2 className="h-4 w-4" />
        Share
      </button>

      {/* modal */}
      {open && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80 space-y-4">
            {/* header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">
                Share “{budget.name}”
              </h3>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* input */}
            <div className="space-y-2">
              <label className="block text-sm">
                Enter user IDs (comma‑separated)
              </label>
              <input
                type="text"
                value={value}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setValue(e.target.value)
                }
                className="input input-bordered w-full border-2"
                disabled={busy}
                placeholder="123, 456, 789"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* actions */}
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="btn px-3 py-1"
                disabled={busy}
              >
                Cancel
              </button>
              <button
                onClick={submit}
                className="btn btn-primary px-3 py-1 disabled:opacity-50"
                disabled={busy}
              >
                {busy ? "Sending…" : "Send Invites"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
