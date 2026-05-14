"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Brain,
  Wrench,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { QuizQuestion } from "@/lib/content/types";

const DIFFICULTY_CONFIG = {
  junior: { label: "Junior", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  mid: { label: "Mid-level", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  senior: { label: "Senior", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

function AnswerContent({ answer }: { answer: string }) {
  const lines = answer.split("\n");
  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        if (!line.trim()) return null;
        const html = line
          .replace(/\*\*([^*]+)\*\*/g, '<strong class="text-zinc-200 font-semibold">$1</strong>')
          .replace(/`([^`]+)`/g, '<code class="bg-zinc-800 border border-zinc-700/50 px-1.5 py-0.5 rounded text-orange-300 text-xs font-mono">$1</code>');
        if (line.startsWith("- ")) {
          return (
            <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-zinc-600 shrink-0" />
              <span dangerouslySetInnerHTML={{ __html: html.slice(2) }} />
            </div>
          );
        }
        if (/^\d+\. /.test(line)) {
          const num = line.match(/^(\d+)\. /)?.[1];
          return (
            <div key={i} className="flex items-start gap-2.5 text-sm text-zinc-400">
              <span className="mt-0.5 h-5 w-5 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-[11px] font-medium text-zinc-400 shrink-0">
                {num}
              </span>
              <span dangerouslySetInnerHTML={{ __html: html.replace(/^\d+\. /, "") }} />
            </div>
          );
        }
        return (
          <p key={i} className="text-sm text-zinc-400 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: html }} />
          </p>
        );
      })}
    </div>
  );
}

function QuestionCard({
  q,
  index,
  globalIndex,
  isRevealed,
  onToggle,
  accentColor,
  accentBg,
  accentBorder,
}: {
  q: QuizQuestion;
  index: number;
  globalIndex: number;
  isRevealed: boolean;
  onToggle: () => void;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
}) {
  const [hintVisible, setHintVisible] = useState(false);
  const diff = q.difficulty ? DIFFICULTY_CONFIG[q.difficulty] : null;

  return (
    <div
      className={cn(
        "rounded-xl border transition-all duration-200",
        isRevealed
          ? `border-${accentBorder} ${accentBg}`
          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-700"
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-zinc-400">
          {globalIndex + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-200 leading-relaxed">{q.question}</p>

          {/* Hint for hands-on questions */}
          {q.hint && !isRevealed && (
            <div className="mt-2">
              {hintVisible ? (
                <div className="flex items-start gap-2 mt-1 p-2.5 rounded-lg bg-amber-500/8 border border-amber-500/20">
                  <Lightbulb className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300/80">{q.hint}</p>
                </div>
              ) : (
                <button
                  onClick={() => setHintVisible(true)}
                  className="mt-1 flex items-center gap-1 text-[11px] text-amber-500/70 hover:text-amber-400 transition-colors"
                >
                  <Lightbulb className="h-3 w-3" />
                  Show hint
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-2">
          {diff && (
            <span className={cn("hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border", diff.bg, diff.color)}>
              {diff.label}
            </span>
          )}
          <button
            onClick={onToggle}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              isRevealed
                ? `bg-${accentColor}/15 text-${accentColor}-300 border border-${accentColor}/30 hover:bg-${accentColor}/20`
                : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200 hover:border-zinc-600"
            )}
          >
            {isRevealed ? (
              <><ChevronUp className="h-3.5 w-3.5" /> Hide</>
            ) : (
              <><Eye className="h-3.5 w-3.5" /> Reveal</>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isRevealed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 ml-9 border-t border-zinc-700/30 pt-3">
              <div className={cn("text-[10px] font-semibold uppercase tracking-wider mb-2", `text-${accentColor}-400`)}>
                {q.type === "hands-on" ? "Solution & Explanation" : "Model Answer"}
              </div>
              <AnswerContent answer={q.answer} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function QuizSection({ questions }: { questions: QuizQuestion[] }) {
  const [activeTab, setActiveTab] = useState<"scenario" | "hands-on">("scenario");
  const [revealed, setRevealed] = useState<Set<string>>(new Set());

  const scenarioQs = questions.filter((q) => q.type === "scenario");
  const handsOnQs = questions.filter((q) => q.type === "hands-on");

  const activeQs = activeTab === "scenario" ? scenarioQs : handsOnQs;
  const allRevealed = activeQs.every((_, i) => revealed.has(`${activeTab}-${i}`));

  const toggleQ = (tab: string, i: number) => {
    const key = `${tab}-${i}`;
    setRevealed((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAll = () => {
    if (allRevealed) {
      setRevealed((prev) => {
        const next = new Set(prev);
        activeQs.forEach((_, i) => next.delete(`${activeTab}-${i}`));
        return next;
      });
    } else {
      setRevealed((prev) => {
        const next = new Set(prev);
        activeQs.forEach((_, i) => next.add(`${activeTab}-${i}`));
        return next;
      });
    }
  };

  return (
    <section className="mt-12 border-t border-zinc-800 pt-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Brain className="h-4.5 w-4.5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Quiz & Practice</h2>
            <p className="text-xs text-zinc-500">{questions.length} questions — scenario + hands-on</p>
          </div>
        </div>
        <button
          onClick={toggleAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 transition-all"
        >
          {allRevealed ? (
            <><EyeOff className="h-3.5 w-3.5" /> Hide All</>
          ) : (
            <><Eye className="h-3.5 w-3.5" /> Reveal All</>
          )}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 p-1 bg-zinc-900 rounded-xl border border-zinc-800 w-fit">
        <button
          onClick={() => setActiveTab("scenario")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "scenario"
              ? "bg-purple-500/15 text-purple-300 border border-purple-500/30"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Brain className="h-3.5 w-3.5" />
          Scenario & Interview
          <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
            {scenarioQs.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab("hands-on")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
            activeTab === "hands-on"
              ? "bg-teal-500/15 text-teal-300 border border-teal-500/30"
              : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          <Terminal className="h-3.5 w-3.5" />
          Hands-On Challenges
          <span className="ml-1 px-1.5 py-0.5 text-[10px] rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700">
            {handsOnQs.length}
          </span>
        </button>
      </div>

      {/* Tab description */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === "scenario" ? (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-500/8 border border-purple-500/20 mb-5">
              <Brain className="h-3.5 w-3.5 text-purple-400 shrink-0" />
              <p className="text-xs text-purple-300/80">
                Real-world scenario questions — answer as you would in a technical interview or incident review.
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-teal-500/8 border border-teal-500/20 mb-5">
              <Wrench className="h-3.5 w-3.5 text-teal-400 shrink-0" />
              <p className="text-xs text-teal-300/80">
                Hands-on challenges — try each task yourself before revealing the solution. Use hints if you get stuck.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {activeQs.map((q, i) => {
              const globalIndex = activeTab === "scenario" ? i : scenarioQs.length + i;
              return (
                <QuestionCard
                  key={i}
                  q={q}
                  index={i}
                  globalIndex={globalIndex}
                  isRevealed={revealed.has(`${activeTab}-${i}`)}
                  onToggle={() => toggleQ(activeTab, i)}
                  accentColor={activeTab === "scenario" ? "purple" : "teal"}
                  accentBg={activeTab === "scenario" ? "bg-purple-500/5" : "bg-teal-500/5"}
                  accentBorder={activeTab === "scenario" ? "purple-500/25" : "teal-500/25"}
                />
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
