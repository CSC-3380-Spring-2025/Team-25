/* =========================================================
   Route: /dashboard/transactions
   ========================================================= */
   "use client";

   import React, {
     useEffect,
     useState,
     useCallback,
     useMemo,
   } from "react";
   import { DollarSign, PlusCircle } from "lucide-react";
   
   const POLL_MS = 10_000; // refresh history every 10 s
   
   export default function TransactionsPage() {
     /* ────────────── state ────────────── */
     const [budgets, setBudgets] = useState([]);
     const [selected, setSelected] = useState(null); // budget id
     const [txns, setTxns] = useState([]);
     const [form, setForm] = useState({ amount: "", note: "" });
   
     /* ─────────────── load budgets ─────────────── */
     useEffect(() => {
       fetch("/api/budgets")
         .then((r) => r.json())
         .then((rows) => {
           setBudgets(rows);
           if (rows[0]) setSelected(rows[0].id);
         })
         .catch(console.error);
     }, []);
   
     /* ─────────────── load txns ─────────────── */
     const loadTxns = useCallback(() => {
       if (!selected) return;
       fetch(`/api/budgets/${selected}/transactions`, { cache: "no-store" })
         .then((r) => r.json())
         .then(setTxns)
         .catch(console.error);
     }, [selected]);
   
     useEffect(() => {
       loadTxns();
       const t = setInterval(loadTxns, POLL_MS);
       return () => clearInterval(t);
     }, [loadTxns]);
   
     /* ─────────────── create txn ─────────────── */
     const addTxn = async (e) => {
       e.preventDefault();
       if (!selected || !form.amount) return;
   
       const res = await fetch(
         `/api/budgets/${selected}/transactions`,
         {
           method: "POST",
           headers: { "Content-Type": "application/json" },
           body: JSON.stringify({
             amount: Number(form.amount),
             note: form.note,
           }),
         }
       );
   
       if (res.ok) {
         setForm({ amount: "", note: "" });
         loadTxns();
       } else {
         console.error("Add txn failed:", await res.text());
       }
     };
   
     /* ───────────── progress calc ───────────── */
     const { percent, spent, target } = useMemo(() => {
       const budget = budgets.find((b) => b.id === selected);
       if (!budget) return { percent: 0, spent: 0, target: 0 };
   
       // Treat negative numbers as spending; positive as income
       const spentAbs = txns
         .filter((t) => t.amount < 0)
         .reduce((sum, t) => sum + Math.abs(t.amount), 0);
   
       const pct =
         budget.targetAmount > 0
           ? Math.min(spentAbs / budget.targetAmount, 1)
           : 0;
   
       return {
         percent: pct,
         spent: spentAbs,
         target: budget.targetAmount,
       };
     }, [txns, budgets, selected]);
   
     /* ─────────────── render ─────────────── */
     return (
       <div className="space-y-8 max-w-2xl">
         <h2 className="text-3xl font-semibold mb-6 flex items-center gap-2">
           <DollarSign className="w-6 h-6" />
           Transactions
         </h2>
   
         {/* budget selector */}
         <select
           className="select select-bordered"
           value={selected ?? ""}
           onChange={(e) => setSelected(Number(e.target.value))}
         >
           {budgets.map((b) => (
             <option key={b.id} value={b.id}>
               {b.name} (${Number(b.targetAmount).toLocaleString()})
             </option>
           ))}
         </select>
   
         {/* ─────── progress bar ─────── */}
         {selected && (
           <div className="space-y-1">
             <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded">
               <div
                 className="h-full bg-green-600 dark:bg-green-500 rounded"
                 style={{ width: `${percent * 100}%` }}
               />
             </div>
             <p className="text-sm text-gray-600 dark:text-gray-400">
               ${spent.toLocaleString()} spent of $
               {target.toLocaleString()} (
               {(percent * 100).toFixed(1)}%)
             </p>
           </div>
         )}
   
         {/* add txn form */}
         <form onSubmit={addTxn} className="flex flex-wrap items-end gap-4">
           <div>
             <label className="block text-sm mb-1">
               Amount (+ income / – expense)
             </label>
             <input
               type="number"
               value={form.amount}
               onChange={(e) =>
                 setForm({ ...form, amount: e.target.value })
               }
               className="input input-bordered w-40 border-2"
               step="0.01"
             />
           </div>
           <div>
             <label className="block text-sm mb-1">Note (optional)</label>
             <input
               type="text"
               value={form.note}
               onChange={(e) => setForm({ ...form, note: e.target.value })}
               className="input input-bordered w-64 border-2"
             />
           </div>
           <button
             type="submit"
             className="rounded-sm bg-primary px-8 py-2 text-sm font-medium text-white shadow-sm flex items-center gap-2 hover:bg-gray-800"
           >
             <PlusCircle className="w-4 h-4" /> Add
           </button>
         </form>
   
         {/* history */}
         <ul className="space-y-2">
           {txns.map((t) => (
             <li
               key={t.id}
               className="border rounded-md p-3 flex justify-between bg-white dark:bg-gray-800"
             >
               <span>{t.note || <em>(no note)</em>}</span>
               <span
                 className={
                   t.amount < 0 ? "text-red-600" : "text-green-600"
                 }
               >
                 {t.amount < 0 ? "-" : "+"}$
                 {Math.abs(t.amount).toLocaleString()}
               </span>
             </li>
           ))}
           {!txns.length && (
             <p className="text-sm text-gray-500">
               No transactions yet
             </p>
           )}
         </ul>
       </div>
     );
   }
   