"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  Home,
  ChevronDown,
  BookOpen,
  FlaskConical,
  Trophy,
  Layers,
  CheckCircle2,
  Circle,
  Wrench,
  Scale,
  Monitor,
  FileCode,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { tracks, getTotalLessons } from "@/lib/content";
import { Progress } from "@/components/ui/progress";
import { useProgress } from "@/lib/hooks/useProgress";
import { useProfile } from "@/lib/hooks/useProfile";

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

interface SidebarProps {
  collapsed?: boolean;
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const pathname = usePathname();
  const { activeProfile } = useProfile();
  const { isCompleted, getTrackProgress } = useProgress(activeProfile?.id ?? null);
  const [expandedTrack, setExpandedTrack] = useState<string | null>(() => {
    // Auto-expand the track that matches the current path
    const match = pathname.match(/^\/tracks\/([^/]+)/);
    return match?.[1] ?? null;
  });
  const [expandedModule, setExpandedModule] = useState<string | null>(() => {
    const match = pathname.match(/^\/tracks\/[^/]+\/([^/]+)/);
    return match?.[1] ?? null;
  });

  const isTrackActive = (trackId: string) => pathname.startsWith(`/tracks/${trackId}`);

  return (
    <nav
      className={cn(
        "flex flex-col h-full bg-zinc-950 border-r border-zinc-800 overflow-hidden transition-all duration-300",
        collapsed ? "w-0" : "w-64"
      )}
    >
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {/* Home link */}
        <Link
          href="/"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm mb-2 transition-colors",
            pathname === "/"
              ? "bg-zinc-800 text-white"
              : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          )}
        >
          <Home className="h-4 w-4 shrink-0" />
          <span className="font-medium">Dashboard</span>
        </Link>

        <div className="h-px bg-zinc-800 my-3" />

        {/* Tracks */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-2">
            Learning Tracks
          </p>

          {tracks.map((track) => {
            const Icon = TRACK_ICONS[track.id] || BookOpen;
            const totalLessons = getTotalLessons(track);
            const { completed, percent } = getTrackProgress(track.id, totalLessons);
            const isExpanded = expandedTrack === track.id;
            const isActive = isTrackActive(track.id);

            return (
              <div key={track.id}>
                {/* Track header */}
                <button
                  onClick={() => setExpandedTrack(isExpanded ? null : track.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors group",
                    isActive
                      ? "text-white"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
                  )}
                >
                  <div
                    className="h-6 w-6 rounded-md flex items-center justify-center shrink-0 transition-colors"
                    style={{
                      background: isActive ? `${track.color}25` : "transparent",
                      border: isActive ? `1px solid ${track.color}40` : "1px solid transparent",
                    }}
                  >
                    <Icon
                      className="h-3.5 w-3.5"
                      style={{ color: isActive ? track.color : undefined }}
                    />
                  </div>
                  <span className="flex-1 text-left font-medium truncate">{track.title}</span>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {completed > 0 && (
                      <span className="text-[10px] text-green-500">{completed}/{totalLessons}</span>
                    )}
                    <ChevronDown
                      className={cn("h-3.5 w-3.5 transition-transform text-zinc-600", isExpanded && "rotate-180")}
                    />
                  </div>
                </button>

                {/* Progress bar for track */}
                {percent > 0 && (
                  <div className="px-3 pb-1">
                    <Progress value={percent} color={track.color} className="h-0.5" />
                  </div>
                )}

                {/* Modules */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pl-3 ml-3 border-l border-zinc-800 mt-1 space-y-0.5">
                        {track.modules.map((module) => {
                          const isModuleExpanded = expandedModule === module.id;
                          const isModuleActive = pathname.includes(`/tracks/${track.id}/${module.id}`);

                          const LEVEL_COLORS: Record<string, string> = {
                            beginner: "text-green-500",
                            intermediate: "text-amber-500",
                            advanced: "text-red-400",
                          };

                          return (
                            <div key={module.id}>
                              <button
                                onClick={() => setExpandedModule(isModuleExpanded ? null : module.id)}
                                className={cn(
                                  "w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-xs transition-colors",
                                  isModuleActive
                                    ? "bg-zinc-800/60 text-zinc-200"
                                    : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                                )}
                              >
                                <span className="flex-1 text-left truncate">{module.title}</span>
                                <span className={cn("text-[10px] shrink-0", LEVEL_COLORS[module.level])}>
                                  {module.level[0].toUpperCase()}
                                </span>
                                <ChevronDown
                                  className={cn("h-3 w-3 shrink-0 text-zinc-700 transition-transform", isModuleExpanded && "rotate-180")}
                                />
                              </button>

                              <AnimatePresence initial={false}>
                                {isModuleExpanded && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.15 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="pl-2 ml-1 border-l border-zinc-800/60 mt-0.5 space-y-0.5">
                                      {module.lessons.map((lesson) => {
                                        const LessonIcon = LESSON_TYPE_ICONS[lesson.type] || BookOpen;
                                        const lessonPath = `/tracks/${track.id}/${module.id}/${lesson.id}`;
                                        const isCurrentLesson = pathname === lessonPath;
                                        const completed = isCompleted(track.id, module.id, lesson.id);

                                        return (
                                          <Link
                                            key={lesson.id}
                                            href={lessonPath}
                                            className={cn(
                                              "flex items-center gap-2 px-2 py-1.5 rounded-md text-[11px] transition-colors",
                                              isCurrentLesson
                                                ? "bg-zinc-800 text-white"
                                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                                            )}
                                          >
                                            {completed ? (
                                              <CheckCircle2 className="h-3 w-3 shrink-0 text-green-500" />
                                            ) : (
                                              <Circle className={cn("h-3 w-3 shrink-0", isCurrentLesson ? "text-zinc-400" : "text-zinc-700")} />
                                            )}
                                            <span className="truncate flex-1">{lesson.title}</span>
                                            <span className="text-zinc-700 shrink-0">{lesson.duration}m</span>
                                          </Link>
                                        );
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
