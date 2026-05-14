"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GitBranch,
  Workflow,
  Code2,
  Container,
  Globe,
  Terminal,
  Server,
  ShieldCheck,
  Cloud,
  Sparkles,
  ArrowRight,
  BookOpen,
  Clock,
  CheckCircle2,
  Flame,
  Layers,
  ChevronRight,
  Trophy,
  Zap,
  CheckSquare,
  Square,
  ExternalLink,
  Check,
  Wrench,
  Scale,
  Monitor,
  FileCode,
  Lock,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { tracks, getTotalLessons, getTotalDuration } from "@/lib/content";
import { useProgress } from "@/lib/hooks/useProgress";
import { useProfile } from "@/lib/hooks/useProfile";
import { useTasks } from "@/lib/hooks/useTasks";
import { formatDuration, cn } from "@/lib/utils";

const TRACK_ICONS: Record<string, React.ElementType> = {
  git: GitBranch,
  "github-actions": Workflow,
  python: Code2,
  docker: Container,
  "linux-networking": Globe,
  linux: Terminal,
  terraform: Server,
  devsecops: ShieldCheck,
  aws: Cloud,
  "prompt-engineering": Sparkles,
  kubernetes: Layers,
  troubleshooting: Wrench,
  compliance: Scale,
  "web-technology": Monitor,
  scripting: FileCode,
  "ssh-protocols": Lock,
};

function TrackCard({
  track,
  progress,
  delay = 0,
}: {
  track: (typeof tracks)[0];
  progress: { completed: number; total: number; percent: number };
  delay?: number;
}) {
  const Icon = TRACK_ICONS[track.id] || BookOpen;
  const totalDuration = getTotalDuration(track);
  const firstLesson = track.modules[0]?.lessons[0];

  const levelCounts = track.modules.reduce(
    (acc, m) => {
      acc[m.level] = (acc[m.level] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="h-full"
    >
      <Link
        href={
          firstLesson
            ? `/tracks/${track.id}/${track.modules[0].id}/${firstLesson.id}`
            : `/tracks/${track.id}`
        }
        className="flex flex-col h-full rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 hover:border-zinc-700 hover:bg-zinc-900 transition-all duration-200 group relative overflow-hidden"
      >
        {/* Subtle glow */}
        <div
          className="absolute -top-8 -right-8 h-28 w-28 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
          style={{ background: track.color }}
        />

        <div className="relative flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-5">
            <div
              className="h-11 w-11 rounded-xl flex items-center justify-center ring-1 ring-white/5"
              style={{ background: `${track.color}18`, border: `1px solid ${track.color}30` }}
            >
              <Icon className="h-5 w-5" style={{ color: track.color }} />
            </div>
            {progress.percent === 100 ? (
              <Badge variant="success" className="gap-1">
                <Trophy className="h-3 w-3" /> Complete
              </Badge>
            ) : progress.percent > 0 ? (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{ background: `${track.color}15`, color: track.color }}
              >
                {progress.percent}% done
              </span>
            ) : null}
          </div>

          {/* Title and description */}
          <h3 className="font-semibold text-base text-zinc-100 mb-1.5 group-hover:text-white transition-colors">
            {track.title}
          </h3>
          <p className="text-xs text-zinc-500 mb-5 leading-relaxed flex-1">{track.description}</p>

          {/* Level tags */}
          <div className="flex items-center gap-1.5 mb-5">
            {Object.entries(levelCounts).map(([level, count]) => {
              const COLORS: Record<string, string> = {
                beginner: "bg-green-500/10 text-green-500 border-green-500/20",
                intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
                advanced: "bg-red-500/10 text-red-500 border-red-500/20",
              };
              return (
                <span
                  key={level}
                  className={cn("text-[10px] px-1.5 py-0.5 rounded-full border font-medium capitalize", COLORS[level])}
                >
                  {level}
                </span>
              );
            })}
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs text-zinc-600 mb-4">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3 w-3" />
              {progress.total} lessons
            </span>
            <span className="text-zinc-800">·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(totalDuration)}
            </span>
            <span className="text-zinc-800">·</span>
            <span className="flex items-center gap-1">
              <Layers className="h-3 w-3" />
              {track.modules.length} modules
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <Progress value={progress.percent} color={track.color} className="h-1" />
            <div className="flex justify-between text-[11px] text-zinc-600">
              <span>
                {progress.completed}/{progress.total} completed
              </span>
              <span className="flex items-center gap-1 text-zinc-500 group-hover:text-zinc-300 transition-colors font-medium">
                {progress.percent > 0 ? "Continue" : "Start learning"}{" "}
                <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function DashboardPage() {
  const { activeProfile } = useProfile();
  const { getTrackProgress, getRecentlyCompleted } = useProgress(activeProfile?.id ?? null);
  const { tasks, toggleTask } = useTasks(activeProfile?.id ?? null);
  const [rightTab, setRightTab] = useState<"learning" | "tasks">("learning");

  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const totalCompleted = tracks.reduce((sum, t) => {
    const total = getTotalLessons(t);
    return sum + getTrackProgress(t.id, total).completed;
  }, 0);

  const totalLessons = tracks.reduce((sum, t) => sum + getTotalLessons(t), 0);
  const overallPercent = totalLessons > 0 ? Math.round((totalCompleted / totalLessons) * 100) : 0;

  const recentlyCompleted = getRecentlyCompleted(3);

  const inProgressTracks = tracks.filter((t) => {
    const p = getTrackProgress(t.id, getTotalLessons(t));
    return p.percent > 0 && p.percent < 100;
  });

  return (
    <AppShell>
      <div className="min-h-full">
        {/* Hero section */}
        <div className="relative border-b border-zinc-800/60 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(59,130,246,0.06),transparent)]" />

          <div className="relative px-8 py-10 max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              {/* Profile greeting */}
              <div className="flex items-center gap-3 mb-8">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-xs font-bold text-white ring-2 ring-zinc-950 shrink-0">
                  {activeProfile?.avatar ?? "?"}
                </div>
                <div>
                  <p className="text-[11px] text-zinc-600 uppercase tracking-wide">Welcome back</p>
                  <p className="text-sm font-semibold text-zinc-200">{activeProfile?.name ?? "Learner"}</p>
                </div>
              </div>

              <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                Your Learning Dashboard
              </h1>
              <p className="text-zinc-500 text-sm mb-8 max-w-xl leading-relaxed">
                Master DevOps and engineering — from Git fundamentals to production-grade CI/CD pipelines.
              </p>

              {/* Stats row */}
              <div className="flex items-center gap-8">
                <div className="min-w-[200px]">
                  <div className="flex justify-between text-xs text-zinc-500 mb-2">
                    <span>Overall Progress</span>
                    <span className="text-zinc-300 font-semibold tabular-nums">{overallPercent}%</span>
                  </div>
                  <Progress value={overallPercent} className="h-1.5" />
                  <p className="text-xs text-zinc-700 mt-1.5 tabular-nums">
                    {totalCompleted} / {totalLessons} lessons
                  </p>
                </div>

                {totalCompleted > 0 && (
                  <>
                    <div className="h-8 w-px bg-zinc-800" />
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                        <Flame className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{totalCompleted}</p>
                        <p className="text-[10px] text-zinc-600">lessons done</p>
                      </div>
                    </div>
                  </>
                )}

                {inProgressTracks.length > 0 && (
                  <>
                    <div className="h-8 w-px bg-zinc-800" />
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                        <Zap className="h-4 w-4 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{inProgressTracks.length}</p>
                        <p className="text-[10px] text-zinc-600">tracks active</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-10 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Tracks grid */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-sm font-semibold text-zinc-300">Learning Tracks</h2>
                <span className="text-xs text-zinc-700">{tracks.length} tracks · {totalLessons} lessons</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 auto-rows-fr">
                {tracks.map((track, i) => {
                  const total = getTotalLessons(track);
                  const progress = getTrackProgress(track.id, total);
                  return (
                    <TrackCard
                      key={track.id}
                      track={track}
                      progress={progress}
                      delay={i * 0.07}
                    />
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-5">
              {/* Tabbed panel: Continue Learning + My Tasks */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.28, duration: 0.4 }}
                className="rounded-2xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
              >
                {/* Tab bar */}
                <div className="flex border-b border-zinc-800">
                  <button
                    onClick={() => setRightTab("learning")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors",
                      rightTab === "learning"
                        ? "text-orange-400 border-b-2 border-orange-500 -mb-px bg-zinc-900/40"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <Flame className="h-3.5 w-3.5" />
                    Continue Learning
                  </button>
                  <button
                    onClick={() => setRightTab("tasks")}
                    className={cn(
                      "flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-medium transition-colors",
                      rightTab === "tasks"
                        ? "text-blue-400 border-b-2 border-blue-500 -mb-px bg-zinc-900/40"
                        : "text-zinc-500 hover:text-zinc-300"
                    )}
                  >
                    <CheckSquare className="h-3.5 w-3.5" />
                    My Tasks
                    {pendingTasks.length > 0 && (
                      <span className={cn(
                        "px-1.5 py-0.5 rounded-full text-[10px] font-semibold",
                        rightTab === "tasks" ? "bg-blue-500/20 text-blue-400" : "bg-zinc-800 text-zinc-400"
                      )}>
                        {pendingTasks.length}
                      </span>
                    )}
                  </button>
                </div>

                <div className="p-4">
                  {/* Continue Learning tab */}
                  {rightTab === "learning" && (
                    inProgressTracks.length > 0 ? (
                      <div className="space-y-2">
                        {inProgressTracks.map((track) => {
                          const Icon = TRACK_ICONS[track.id] || BookOpen;
                          const total = getTotalLessons(track);
                          const { percent, completed } = getTrackProgress(track.id, total);
                          const firstLesson = track.modules[0]?.lessons[0];
                          return (
                            <Link
                              key={track.id}
                              href={`/tracks/${track.id}/${track.modules[0]?.id}/${firstLesson?.id}`}
                              className="flex items-center gap-3 p-3 rounded-xl hover:bg-zinc-800/60 transition-colors group border border-transparent hover:border-zinc-800"
                            >
                              <div
                                className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                                style={{ background: `${track.color}15`, border: `1px solid ${track.color}25` }}
                              >
                                <Icon className="h-4 w-4" style={{ color: track.color }} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs font-medium text-zinc-300 truncate">{track.title}</p>
                                  <span className="text-[10px] text-zinc-600 ml-2 shrink-0">{percent}%</span>
                                </div>
                                <Progress value={percent} color={track.color} className="h-1" />
                                <p className="text-[10px] text-zinc-600 mt-1">{completed}/{total} done</p>
                              </div>
                              <ChevronRight className="h-3.5 w-3.5 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-6 space-y-2">
                        <BookOpen className="h-8 w-8 text-zinc-800 mx-auto" />
                        <p className="text-xs text-zinc-600 leading-relaxed">
                          Start a track below to see your in-progress courses here
                        </p>
                      </div>
                    )
                  )}

                  {/* My Tasks tab */}
                  {rightTab === "tasks" && (
                    <div className="space-y-1">
                      {tasks.length === 0 ? (
                        <div className="text-center py-6 space-y-2">
                          <CheckSquare className="h-8 w-8 text-zinc-800 mx-auto" />
                          <p className="text-xs text-zinc-600 leading-relaxed">
                            No tasks yet. Open a lesson and add tasks from the Notes panel.
                          </p>
                        </div>
                      ) : (
                        <>
                          {/* Pending tasks */}
                          {pendingTasks.length > 0 && (
                            <div className="space-y-1.5">
                              {pendingTasks.map((task) => (
                                <div key={task.id} className="group flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-800/50 border border-zinc-700/40 hover:border-zinc-700 transition-colors">
                                  <button
                                    onClick={() => toggleTask(task.id)}
                                    className="mt-0.5 shrink-0 text-zinc-600 hover:text-green-400 transition-colors"
                                  >
                                    <Square className="h-3.5 w-3.5" />
                                  </button>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-medium text-zinc-300 leading-snug">{task.title}</p>
                                    {task.description && (
                                      <p className="text-[10px] text-zinc-600 mt-0.5 leading-relaxed line-clamp-2">{task.description}</p>
                                    )}
                                    {task.lessonId && task.lessonTitle && (
                                      <Link
                                        href={`/tracks/${task.trackId}/${task.moduleId}/${task.lessonId}`}
                                        className="inline-flex items-center gap-1 mt-1 text-[10px] text-blue-500 hover:text-blue-400 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <ExternalLink className="h-2.5 w-2.5" />
                                        {task.lessonTitle}
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Completed tasks (collapsed) */}
                          {completedTasks.length > 0 && (
                            <div className="mt-3">
                              <p className="text-[10px] uppercase tracking-widest text-zinc-700 mb-1.5">Completed ({completedTasks.length})</p>
                              <div className="space-y-1">
                                {completedTasks.map((task) => (
                                  <div key={task.id} className="flex items-center gap-2.5 p-2 rounded-lg">
                                    <button onClick={() => toggleTask(task.id)} className="shrink-0 text-green-500">
                                      <Check className="h-3.5 w-3.5" />
                                    </button>
                                    <p className="text-[11px] text-zinc-600 line-through truncate">{task.title}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Recently Completed */}
              {recentlyCompleted.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.36, duration: 0.4 }}
                  className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5"
                >
                  <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                    Recently Completed
                  </h3>
                  <div className="space-y-1.5">
                    {recentlyCompleted.map((entry, i) => {
                      const track = tracks.find((t) => t.id === entry.trackId);
                      const module = track?.modules.find((m) => m.id === entry.moduleId);
                      const lesson = module?.lessons.find((l) => l.id === entry.lessonId);
                      if (!track || !lesson) return null;
                      const Icon = TRACK_ICONS[track.id] || BookOpen;

                      return (
                        <Link
                          key={i}
                          href={`/tracks/${entry.trackId}/${entry.moduleId}/${entry.lessonId}`}
                          className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-zinc-800/60 transition-colors group"
                        >
                          <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-zinc-400 truncate group-hover:text-zinc-200 transition-colors">
                              {lesson.title}
                            </p>
                            <p className="text-[10px] text-zinc-700 flex items-center gap-1 mt-0.5">
                              <Icon className="h-3 w-3" style={{ color: track.color }} />
                              {track.title}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Quick start */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.44, duration: 0.4 }}
                className="rounded-2xl bg-gradient-to-br from-blue-950/40 via-zinc-900/40 to-violet-950/30 border border-blue-900/30 p-5"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-white">New to DevOps?</h3>
                </div>
                <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
                  Start with Git — it's the foundation of every modern engineering workflow.
                </p>
                <Button size="sm" asChild className="w-full gap-2">
                  <Link href="/tracks/git/intro-to-git/what-is-git">
                    <GitBranch className="h-3.5 w-3.5" />
                    Start with Git
                    <ArrowRight className="h-3.5 w-3.5 ml-auto" />
                  </Link>
                </Button>
              </motion.div>

              {/* Track count summary */}
              <motion.div
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.52, duration: 0.4 }}
                className="rounded-2xl border border-zinc-800/50 bg-zinc-950/50 p-4"
              >
                <p className="text-[10px] text-zinc-700 uppercase tracking-widest mb-3">Track Overview</p>
                <div className="space-y-2">
                  {tracks.map((track) => {
                    const Icon = TRACK_ICONS[track.id] || BookOpen;
                    const total = getTotalLessons(track);
                    const { percent } = getTrackProgress(track.id, total);
                    return (
                      <div key={track.id} className="flex items-center gap-2.5">
                        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: track.color }} />
                        <span className="text-xs text-zinc-500 flex-1 truncate">{track.title}</span>
                        <span className="text-[10px] font-mono text-zinc-700 tabular-nums">{percent}%</span>
                        <div className="w-16">
                          <Progress value={percent} color={track.color} className="h-0.5" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
