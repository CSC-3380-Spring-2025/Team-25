"use client";
import React, { useState } from "react";
import { Plus, Users } from "lucide-react";
import ShareButton from "./_components/ShareButton";

export default function BudgetsPage() {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ name: "", target: "" });

  const addBudget = (e) => {
    e.preventDefault();
    if (!form.name || !form.target) return;
    const newBudget = {
      id: Date.now(),
      name: form.name,
      target: parseFloat(form.target),
      members: [],
    };
    setBudgets([...budgets, newBudget]);
    setForm({ name: "", target: "" });
  };

  const handleShare = (budgetId, memberIds) => {
    setBudgets(
      budgets.map((b) =>
        b.id === budgetId ? { ...b, members: [...b.members, ...memberIds] } : b
      )
    );
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2">
        <Users className="w-6 h-6" /> Budgets
      </h2>

      {/* Create Budget */}
      <form onSubmit={addBudget} className="flex flex-wrap items-end gap-4">
        <div>
          <label className="block text-sm mb-1">Budget Name</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="input input-bordered w-64 border-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Target Amount ($)</label>
          <input
            type="number"
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
            className="input input-bordered w-40 border-2"
          />
        </div>
        <button type="submit" className="rounded-sm bg-primary px-10 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-3 focus:outline-none focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Create
        </button>
      </form>

      {/* List Budgets */}
      <ul className="space-y-4">
        {budgets.map((b) => (
          <li
            key={b.id}
            className="border rounded-lg p-4 bg-white dark:bg-gray-800 flex items-center justify-between"
          >
            <div>
              <p className="font-medium">{b.name}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                ${b.target.toLocaleString()} target · {b.members.length} member
                {b.members.length !== 1 && "s"}
              </p>
            </div>
            <ShareButton budget={b} onShare={handleShare} />
          </li>
        ))}
      </ul>
    </div>
  );
}