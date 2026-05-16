"use client";

import React, { useState, useRef, useEffect } from "react";
import { GitBranch, User } from "lucide-react";
import { useProfile } from "@/lib/hooks/useProfile";

export function CreateProfileModal() {
  const { activeProfile, createProfile, setActiveProfile } = useProfile();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const visible = activeProfile === null;

  useEffect(() => {
    if (visible) setTimeout(() => inputRef.current?.focus(), 80);
  }, [visible]);

  if (!visible) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required");
      return;
    }
    const profile = createProfile(trimmed, bio.trim());
    setActiveProfile(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-sm mx-4 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-7 pb-5 text-center">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-violet-600 mb-4 shadow-lg">
            <GitBranch className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-100">Welcome to DevOps Learn</h2>
          <p className="mt-1 text-sm text-zinc-400">Create a profile to track your progress</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-7 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Your name <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="e.g. Alex Chen"
                value={name}
                onChange={(e) => { setName(e.target.value); setError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as unknown as React.FormEvent)}
                className="w-full pl-9 pr-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
              />
            </div>
            {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Role / bio <span className="text-zinc-600">(optional)</span>
            </label>
            <input
              type="text"
              placeholder="e.g. DevOps Engineer"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit(e as unknown as React.FormEvent)}
              className="w-full px-3 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-1 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-all shadow-lg shadow-blue-900/20"
          >
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
}
