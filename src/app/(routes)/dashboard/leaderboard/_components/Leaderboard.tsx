/* ---------------------------------------------------------------------
 *  Leaderboard component
 *  -------------------------------------------------------------
 *  Shows the top budgets in the whole DB ranked by dollars spent.
 *  Fetches data once on mount, so you can drop it into any page.
 * -------------------------------------------------------------------*/
"use client";

import React, { useEffect, useState } from "react";

export interface LeaderboardRow {
  id: number | string;
  name: string;
  spent: number;        // dollars
}

interface Props {
  /** How many rows to show (default = 5). */
  limit?: number;
}

export default function Leaderboard({ limit = 5 }: Props): React.JSX.Element | null {
  const [rows, setRows] = useState<LeaderboardRow[]>([]);

  useEffect(() => {
    fetch(`/api/leaderboard?limit=${limit}`)
      .then((r) => r.json() as Promise<LeaderboardRow[]>)
      .then(setRows)
      .catch(console.error);
  }, [limit]);

  if (rows.length === 0) return null;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">
        Top {rows.length} Budgets by Dollars Spent
      </h3>

      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700 text-left text-sm">
          <tr>
            <th className="px-4 py-2 w-12">#</th>
            <th className="px-4 py-2">Budget</th>
            <th className="px-4 py-2 text-right">Total Spent</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} className="border-t dark:border-gray-700">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{row.name}</td>
              <td className="px-4 py-2 text-right">{fmt(row.spent)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
