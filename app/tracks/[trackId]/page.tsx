"use client";

import React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  Layers,
  FlaskConical,
  Trophy,
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
  Play,
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
import { getTrack, getTotalLessons, getTotalDuration } from "@/lib/content";
import { useProgress } from "@/lib/hooks/useProgress";
import { useProfile } from "@/lib/hooks/useProfile";
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

const LESSON_TYPE_ICONS: Record<string, React.ElementType> = {
  lesson: BookOpen,
  lab: FlaskConical,
  quiz: Trophy,
  project: Layers,
  exercise: FlaskConical,
};

const LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  beginner: { label: "Beginner", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
  intermediate: { label: "Intermediate", color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
  advanced: { label: "Advanced", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
};

export default function TrackPage() {
  const params = useParams<{ trackId: string }>();
  const track = getTrack(params.trackId);

  if (!track) return notFound();

  const { activeProfile } = useProfile();
  const { isCompleted, getTrackProgress } = useProgress(activeProfile?.id ?? null);

  const TrackIcon = TRACK_ICONS[track.id] || BookOpen;
  const totalLessons = getTotalLessons(track);
  const totalDuration = getTotalDuration(track);
  const { completed, percent } = getTrackProgress(track.id, totalLessons);

  const firstIncomplete = (() => {
    for (const m of track.modules) {
      for (const l of m.lessons) {
        if (!isCompleted(track.id, m.id, l.id)) {
          return { moduleId: m.id, lessonId: l.id };
        }
      }
    }
    return null;
  })();

  return (
    <AppShell>
      <div className="min-h-full">
        {/* Track hero */}
        <div className="relative border-b border-zinc-800 overflow-hidden">
          <div
            className="absolute inset-0 opacity-5"
            style={{ background: `radial-gradient(ellipse at top left, ${track.color}, transparent 60%)` }}
          />
          <div className="relative px-8 py-10 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Link href="/" className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mb-6">
                <ChevronRight className="h-3 w-3 rotate-180" />
                Dashboard
              </Link>

              <div className="flex items-start gap-5">
                <div
                  className="h-14 w-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${track.color}20`, border: `1.5px solid ${track.color}40` }}
                >
                  <TrackIcon className="h-7 w-7" style={{ color: track.color }} />
                </div>

                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl font-bold text-white mb-1 tracking-tight">{track.title}</h1>
                  <p className="text-sm text-zinc-400 leading-relaxed mb-5 max-w-2xl">
                    {track.longDescription}
                  </p>

                  {/* Stats row */}
                  <div className="flex items-center flex-wrap gap-4 text-sm text-zinc-500 mb-5">
                    <span className="flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      <strong className="text-zinc-300">{totalLessons}</strong> lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <strong className="text-zinc-300">{formatDuration(totalDuration)}</strong> total
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      <strong className="text-zinc-300">{track.modules.length}</strong> modules
                    </span>
                    <span className="flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <strong className="text-zinc-300">{completed}</strong> completed
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="max-w-sm space-y-1.5 mb-5">
                    <Progress value={percent} color={track.color} />
                    <p className="text-xs text-zinc-600">{percent}% complete</p>
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-3">
                    {firstIncomplete ? (
                      <Button asChild>
                        <Link href={`/tracks/${track.id}/${firstIncomplete.moduleId}/${firstIncomplete.lessonId}`}>
                          <Play className="h-4 w-4" />
                          {percent > 0 ? "Continue Learning" : "Start Track"}
                        </Link>
                      </Button>
                    ) : (
                      <Button variant="secondary" disabled>
                        <Trophy className="h-4 w-4 text-amber-400" />
                        Track Complete!
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Modules */}
        <div className="px-8 py-10 max-w-5xl mx-auto">
          <h2 className="text-base font-semibold text-white mb-6">Course Content</h2>

          <div className="space-y-4">
            {track.modules.map((module, mi) => {
              const levelCfg = LEVEL_CONFIG[module.level];
              const moduleLessonsCompleted = module.lessons.filter((l) =>
                isCompleted(track.id, module.id, l.id)
              ).length;
              const modulePercent = Math.round(
                (moduleLessonsCompleted / module.lessons.length) * 100
              );

              return (
                <motion.div
                  key={module.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: mi * 0.06, duration: 0.35 }}
                  className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden"
                >
                  {/* Module header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800/50">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-7 w-7 rounded-full border-2 flex items-center justify-center text-xs font-bold text-zinc-500"
                        style={{
                          borderColor: modulePercent === 100 ? "#22c55e" : modulePercent > 0 ? track.color : "#3f3f46",
                          color: modulePercent === 100 ? "#22c55e" : modulePercent > 0 ? track.color : undefined,
                        }}
                      >
                        {mi + 1}
                      </div>
                      <div>
                        <h3 className="font-medium text-sm text-zinc-200">{module.title}</h3>
                        <p className="text-xs text-zinc-600 mt-0.5">{module.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border", levelCfg.bg, levelCfg.color)}>
                        {levelCfg.label}
                      </span>
                      <span className="text-xs text-zinc-600">
                        {moduleLessonsCompleted}/{module.lessons.length}
                      </span>
                    </div>
                  </div>

                  {/* Module progress */}
                  {modulePercent > 0 && (
                    <Progress value={modulePercent} color={modulePercent === 100 ? "#22c55e" : track.color} className="h-0.5 rounded-none" />
                  )}

                  {/* Lessons */}
                  <div className="divide-y divide-zinc-800/40">
                    {module.lessons.map((lesson, li) => {
                      const LessonIcon = LESSON_TYPE_ICONS[lesson.type] || BookOpen;
                      const done = isCompleted(track.id, module.id, lesson.id);
                      const lessonPath = `/tracks/${track.id}/${module.id}/${lesson.id}`;

                      return (
                        <Link
                          key={lesson.id}
                          href={lessonPath}
                          className="flex items-center gap-4 px-5 py-3.5 hover:bg-zinc-800/30 transition-colors group"
                        >
                          {/* Completion indicator */}
                          {done ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-500 shrink-0" />
                          ) : (
                            <Circle className="h-4.5 w-4.5 text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0" />
                          )}

                          {/* Lesson number */}
                          <span className="text-xs text-zinc-700 font-mono w-5 shrink-0 text-right">
                            {li + 1}
                          </span>

                          {/* Lesson type icon */}
                          <LessonIcon className="h-4 w-4 text-zinc-600 shrink-0" />

                          {/* Title */}
                          <span className={cn("flex-1 text-sm truncate", done ? "text-zinc-500 line-through" : "text-zinc-300 group-hover:text-white transition-colors")}>
                            {lesson.title}
                          </span>

                          {/* Duration */}
                          <span className="text-xs text-zinc-700 shrink-0 flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.duration}m
                          </span>

                          <ChevronRight className="h-4 w-4 text-zinc-700 group-hover:text-zinc-400 transition-colors shrink-0" />
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
