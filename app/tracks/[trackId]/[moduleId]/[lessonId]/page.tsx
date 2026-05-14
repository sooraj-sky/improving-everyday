"use client";

import React, { useState } from "react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  FlaskConical,
  Trophy,
  Layers,
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
  Bookmark,
  Share2,
  NotebookPen,
  Wrench,
  Scale,
  Monitor,
  FileCode,
  Lock,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { LessonContent } from "@/components/lesson/LessonContent";
import { TableOfContents } from "@/components/lesson/TableOfContents";
import { NotesPanel } from "@/components/lesson/NotesPanel";
import { InterviewQuestions } from "@/components/lesson/InterviewQuestions";
import { QuizSection } from "@/components/lesson/QuizSection";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { getLessonWithContext, getTotalLessons } from "@/lib/content";
import { useProgress } from "@/lib/hooks/useProgress";
import { useProfile } from "@/lib/hooks/useProfile";
import { useNotes } from "@/lib/hooks/useNotes";
import { useTasks } from "@/lib/hooks/useTasks";
import { useComments } from "@/lib/hooks/useComments";
import { cn } from "@/lib/utils";

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

const LESSON_TYPE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string }> = {
  lesson: { icon: BookOpen, label: "Lesson", color: "text-blue-400" },
  lab: { icon: FlaskConical, label: "Lab", color: "text-green-400" },
  quiz: { icon: Trophy, label: "Quiz", color: "text-amber-400" },
  project: { icon: Layers, label: "Project", color: "text-purple-400" },
  exercise: { icon: FlaskConical, label: "Exercise", color: "text-teal-400" },
};

const LEVEL_CONFIG: Record<string, { label: string; color: string }> = {
  beginner: { label: "Beginner", color: "text-green-400" },
  intermediate: { label: "Intermediate", color: "text-amber-400" },
  advanced: { label: "Advanced", color: "text-red-400" },
};

export default function LessonPage() {
  const params = useParams<{ trackId: string; moduleId: string; lessonId: string }>();
  const { activeProfile } = useProfile();
  const { isCompleted, markComplete, markIncomplete, getTrackProgress } = useProgress(
    activeProfile?.id ?? null
  );
  const [notesPanelOpen, setNotesPanelOpen] = useState(false);

  // Activity counts for badge
  const { notes } = useNotes(activeProfile?.id ?? null, params.trackId, params.moduleId, params.lessonId);
  const { tasks } = useTasks(activeProfile?.id ?? null, { lessonId: params.lessonId });
  const { comments } = useComments(params.trackId, params.moduleId, params.lessonId);
  const activityCount = notes.length + tasks.filter((t) => !t.completed).length + comments.length;

  const ctx = getLessonWithContext(params.trackId, params.moduleId, params.lessonId);
  if (!ctx) return notFound();

  const { lesson, module, track, prevLesson, nextLesson } = ctx;

  const TrackIcon = TRACK_ICONS[track.id] || BookOpen;
  const typeConfig = LESSON_TYPE_CONFIG[lesson.type] || LESSON_TYPE_CONFIG.lesson;
  const TypeIcon = typeConfig.icon;
  const levelConfig = LEVEL_CONFIG[module.level];

  const completed = isCompleted(track.id, module.id, lesson.id);
  const totalLessons = getTotalLessons(track);
  const { completed: completedCount, percent } = getTrackProgress(track.id, totalLessons);

  return (
    <AppShell>
      <div className="flex min-h-full">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Breadcrumb + header */}
          <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800">
            <div className="px-6 py-3">
              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-600 mb-2">
                <Link href="/" className="hover:text-zinc-400 transition-colors">
                  Dashboard
                </Link>
                <ChevronRight className="h-3 w-3" />
                <Link
                  href={`/tracks/${track.id}`}
                  className="hover:text-zinc-400 transition-colors flex items-center gap-1"
                >
                  <TrackIcon className="h-3 w-3" style={{ color: track.color }} />
                  {track.title}
                </Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-zinc-500">{module.title}</span>
                <ChevronRight className="h-3 w-3" />
                <span className="text-zinc-400 truncate max-w-[200px]">{lesson.title}</span>
              </div>

              {/* Track progress bar */}
              <div className="flex items-center gap-3">
                <Progress value={percent} color={track.color} className="h-0.5 flex-1" />
                <span className="text-[10px] text-zinc-600 shrink-0">
                  {completedCount}/{totalLessons}
                </span>
              </div>
            </div>
          </div>

          {/* Lesson header */}
          <div className="px-8 pt-8 pb-6 border-b border-zinc-800/50">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              {/* Meta badges */}
              <div className="flex items-center flex-wrap gap-2 mb-4">
                <Badge variant="default" className="gap-1">
                  <TypeIcon className={cn("h-3 w-3", typeConfig.color)} />
                  {typeConfig.label}
                </Badge>
                <Badge variant="default">
                  <span className={cn("mr-1", levelConfig.color)}>●</span>
                  {levelConfig.label}
                </Badge>
                <Badge variant="default" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {lesson.duration} min read
                </Badge>
              </div>

              <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">{lesson.title}</h1>
              <p className="text-sm text-zinc-500 leading-relaxed max-w-2xl">{lesson.description}</p>

              {/* Objectives */}
              {lesson.objectives && lesson.objectives.length > 0 && (
                <div className="mt-5 rounded-xl bg-zinc-900/80 border border-zinc-800 p-4">
                  <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                    What you'll learn
                  </p>
                  <ul className="space-y-1.5">
                    {lesson.objectives.map((obj, i) => (
                      <li key={i} className="flex items-center gap-2.5 text-sm text-zinc-400">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>

          {/* Lesson content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="px-8 py-8 max-w-3xl"
          >
            <LessonContent content={lesson.content} />
            {lesson.interviewQuestions && lesson.interviewQuestions.length > 0 && (
              <InterviewQuestions questions={lesson.interviewQuestions} />
            )}
            {lesson.quizQuestions && lesson.quizQuestions.length > 0 && (
              <QuizSection questions={lesson.quizQuestions} />
            )}
          </motion.div>

          {/* Bottom navigation */}
          <div className="px-8 py-8 border-t border-zinc-800">
            {/* Mark complete */}
            <div className="flex items-center justify-between mb-8">
              <Button
                variant={completed ? "secondary" : "default"}
                onClick={() =>
                  completed
                    ? markIncomplete(track.id, module.id, lesson.id)
                    : markComplete(track.id, module.id, lesson.id)
                }
                className={cn(
                  "gap-2",
                  completed && "bg-green-900/30 text-green-400 border border-green-900/50 hover:bg-green-900/40"
                )}
              >
                {completed ? (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Completed!
                  </>
                ) : (
                  <>
                    <Circle className="h-4 w-4" />
                    Mark as Complete
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setNotesPanelOpen(true)}
                  className={cn(
                    "gap-2 text-zinc-400 hover:text-zinc-200 transition-colors",
                    activityCount > 0 && "text-blue-400 hover:text-blue-300"
                  )}
                >
                  <NotebookPen className="h-4 w-4" />
                  Notes & Tasks
                  {activityCount > 0 && (
                    <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      {activityCount}
                    </span>
                  )}
                </Button>
                <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-300">
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-zinc-600 hover:text-zinc-300">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Prev / Next navigation */}
            <div className="grid grid-cols-2 gap-4">
              {prevLesson ? (
                <Link
                  href={`/tracks/${prevLesson.trackId}/${prevLesson.moduleId}/${prevLesson.lessonId}`}
                  className="flex items-center gap-3 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group"
                >
                  <ChevronLeft className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wide mb-0.5">Previous</p>
                    <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-white transition-colors">
                      {prevLesson.title}
                    </p>
                  </div>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/tracks/${nextLesson.trackId}/${nextLesson.moduleId}/${nextLesson.lessonId}`}
                  className="flex items-center justify-end gap-3 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group col-start-2"
                >
                  <div className="min-w-0 text-right">
                    <p className="text-[10px] text-zinc-600 uppercase tracking-wide mb-0.5">Next</p>
                    <p className="text-sm font-medium text-zinc-300 truncate group-hover:text-white transition-colors">
                      {nextLesson.title}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-zinc-300 transition-colors shrink-0" />
                </Link>
              ) : (
                <div className="flex items-center justify-end gap-3 p-4 rounded-xl bg-green-950/20 border border-green-900/30 col-start-2">
                  <div className="text-right">
                    <p className="text-xs text-green-500 font-medium">🎉 Track Complete!</p>
                    <p className="text-xs text-zinc-500 mt-0.5">You've finished this track</p>
                  </div>
                  <Trophy className="h-5 w-5 text-amber-400 shrink-0" />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right sidebar: Table of Contents */}
        <div className="hidden xl:block w-56 shrink-0 border-l border-zinc-800 px-5 py-8">
          <TableOfContents content={lesson.content} />
        </div>
      </div>

      <NotesPanel
        open={notesPanelOpen}
        onClose={() => setNotesPanelOpen(false)}
        trackId={params.trackId}
        moduleId={params.moduleId}
        lessonId={params.lessonId}
        lessonTitle={lesson.title}
        trackTitle={track.title}
      />
    </AppShell>
  );
}
