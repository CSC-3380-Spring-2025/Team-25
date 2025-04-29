"use client";
import React, { useEffect, useState } from "react";

export default function Leaderboard() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetch("/api/leaderboard")
      .then((r) => r.json())
      .then(setRows)
      .catch(console.error);
  }, []);

  if (!rows.length) return null;

  return (
    <div className="mt-12">
      <h3 className="text-xl font-semibold mb-4">Top 5 Budgets by Progress</h3>

      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700 text-left text-sm">
          <tr>
            <th className="px-4 py-2">#</th>
            <th className="px-4 py-2">Budget</th>
            <th className="px-4 py-2">Progress</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.id} className="border-t dark:border-gray-700">
              <td className="px-4 py-2">{i + 1}</td>
              <td className="px-4 py-2">{row.name}</td>
              <td className="px-4 py-2">
                {Math.min(row.percent, 1) /* cap at 100% */}
                { (Math.min(row.percent, 1) * 100).toFixed(1) }%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
