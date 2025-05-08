"use client";
import { Copy } from "lucide-react";
import { useState } from "react";

export default function CopyIdButton({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(id).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={copy}
      className="flex items-center gap-1 text-primary hover:underline"
    >
      <Copy className="h-4 w-4" />
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
