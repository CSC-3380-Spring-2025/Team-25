/* =========================================================
   File: src/app/(routes)/dashboard/budgets/page.jsx
   ========================================================= */
   "use client";

   import React, { useEffect, useState, useCallback } from "react";
   import { Plus, Users, Trash2 } from "lucide-react";
   import ShareButton from "./_components/ShareButton";
   
   const REFRESH_MS = 10_000;          // poll every 10 s – change as needed
   
   export default function BudgetsPage() {
     /* ─────────────── state ─────────────── */
     const [budgets, setBudgets] = useState([]);
     const [form, setForm] = useState({ name: "", targetAmount: "" });
   
     /* TODO: swap for logged-in user’s id */
     const ownerId = 1;
   
     /* ───────── load budgets (reusable) ───────── */
     const loadBudgets = useCallback(async () => {
       try {
         const res = await fetch("/api/budgets", { cache: "no-store" });
         setBudgets(await res.json());
       } catch (err) {
         console.error("Failed to load budgets", err);
       }
     }, []);
   
     /* initial load + polling */
     useEffect(() => {
       loadBudgets();                           // first fetch
       const t = setInterval(loadBudgets, REFRESH_MS);
       return () => clearInterval(t);           // cleanup on unmount
     }, [loadBudgets]);
   
     /* ───────────── create budget ───────────── */
     const addBudget = async (e) => {
       e.preventDefault();
       if (!form.name || !form.targetAmount) return;
   
       try {
         const res = await fetch("/api/budgets", {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             name: form.name,
             targetAmount: Number(form.targetAmount),
             ownerId,
           }),
         });
   
         if (!res.ok) throw new Error(await res.text());
         setForm({ name: "", targetAmount: "" });
         loadBudgets();                         // refresh immediately
       } catch (err) {
         console.error("Failed to create budget", err);
       }
     };
   
     /* ───────────── delete budget ───────────── */
     const handleDelete = async (id) => {
      try {
        const res = await fetch(`/api/budgets/${id}`, { method: "DELETE" });
        if (!res.ok && res.status !== 204) {
        //  console.error("DELETE failed:", await res.text());
          return;                     // stop, but don’t throw
        }
        await loadBudgets();          // refresh list
      } catch (err) {
        console.error("Network error:", err);
      }
    };
    
   
     /* ───────── share (UI-only) ───────── */
     const handleShare = (budgetId, memberIds) =>
       setBudgets((prev) =>
         prev.map((b) =>
           b.id === budgetId
             ? { ...b, members: [...b.members, ...memberIds] }
             : b
         )
       );
   
     /* ─────────────── render ─────────────── */
     return (
       <div className="space-y-8">
         {/* header */}
         <h2 className="text-3xl font-semibold mb-4 flex items-center gap-2">
           <Users className="w-6 h-6" />
           Budgets
         </h2>
   
         {/* create-budget form */}
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
               value={form.targetAmount}
               onChange={(e) =>
                 setForm({ ...form, targetAmount: e.target.value })
               }
               className="input input-bordered w-40 border-2"
             />
           </div>
   
           <button
             type="submit"
             className="rounded-sm bg-primary px-10 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:ring-3 focus:outline-none focus:ring-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 flex items-center gap-2"
           >
             <Plus className="w-4 h-4" /> Create
           </button>
         </form>
   
         {/* list budgets */}
         <ul className="space-y-4">
           {budgets.map((b) => (
             <li
               key={b.id}
               className="border rounded-lg p-4 bg-white dark:bg-gray-800 flex items-center justify-between"
             >
               <div>
                 <p className="font-medium">{b.name}</p>
                 <p className="text-sm text-gray-500 dark:text-gray-400">
                   ${Number(b.targetAmount).toLocaleString()} target ·{" "}
                   {b.members?.length ?? 0} member
                   {(b.members?.length ?? 0) !== 1 && "s"}
                 </p>
               </div>
   
               <div className="flex gap-2">
                 <ShareButton budget={b} onShare={handleShare} />
   
                 <button
                   onClick={() => handleDelete(b.id)}
                   title="Delete budget"
                   className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900 focus:outline-none"
                 >
                   <Trash2 className="w-4 h-4 text-red-600 dark:text-red-300" />
                 </button>
               </div>
             </li>
           ))}
         </ul>
       </div>
     );
   }
   