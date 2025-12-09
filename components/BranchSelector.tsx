"use client";

import { useState } from "react";

interface BranchSelectorProps {
  branches: string[];
  selectedBranch: string;
  setSelectedBranch: (value: string) => void;
}

export default function BranchSelector({
  branches,
  selectedBranch,
  setSelectedBranch,
}: BranchSelectorProps) {
  
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <label className="text-sm mb-2 block">Филиал</label>

      {/* input/button */}
      <div
        onClick={() => setOpen(!open)}
        className="w-full rounded-md bg-white/10 border border-white/20 text-white px-4 py-2 cursor-pointer 
        flex justify-between items-center select-none hover:bg-white/5 transition"
      >
        <span className={selectedBranch ? "" : "text-gray-400"}>
          {selectedBranch || "Выберите филиал"}
        </span>

        <span className="text-gray-300 text-xs">
          {open ? "▲" : "▼"}
        </span>
      </div>

      {/* dropdown */}
      {open && (
        <div
          className="absolute w-full mt-2 bg-[#14006D] border border-white/10 rounded-xl shadow-lg 
          z-20 max-h-48 overflow-y-auto animate-fade"
        >
          {branches.map((branch, i) => (
            <div
              key={i}
              onClick={() => {
                setSelectedBranch(branch);
                setOpen(false);
              }}
              className="px-4 py-2 text-sm hover:bg-white/5 cursor-pointer transition"
            >
              {branch}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
