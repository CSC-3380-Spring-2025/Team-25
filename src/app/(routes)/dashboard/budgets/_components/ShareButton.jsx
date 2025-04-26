"use client";
import React, { useState } from "react";
import { Share2, X } from "lucide-react";

export default function ShareButton({ budget, onShare }) {
  const [open, setOpen] = useState(false);
  const [ids, setIds] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const list = ids
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
    if (list.length) {
      onShare(budget.id, list);
      setIds("");
      setOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="btn btn-outline flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" /> Share
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl w-96 p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Share “{budget.name}”</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1">
                  User IDs (comma-separated)
                </label>
                <input
                  type="text"
                  value={ids}
                  onChange={(e) => setIds(e.target.value)}
                  className="input input-bordered w-full"
                  placeholder="1, 42, 99"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setOpen(false)} className="btn">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Share
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}