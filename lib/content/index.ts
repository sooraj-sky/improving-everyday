import { gitTrack } from "./git";
import { githubActionsTrack } from "./github-actions";
import { pythonTrack } from "./python";
import { dockerTrack } from "./docker";
import { linuxNetworkingTrack } from "./linux-networking";
import { linuxTrack } from "./linux";
import { terraformTrack } from "./terraform";
import { devsecopsTrack } from "./devsecops";
import { awsTrack } from "./aws";
import { promptEngineeringTrack } from "./prompt-engineering";
import { kubernetesTrack } from "./kubernetes";
import { troubleshootingTrack } from "./troubleshooting";
import { sshProtocolsTrack } from "./ssh-protocols";
import { scriptingTrack } from "./scripting";
import { webTechnologyTrack } from "./web-technology";
import { complianceTrack } from "./compliance";
import { databasesTrack } from "./databases";
import { sdlcTrack } from "./sdlc";
import type { Track, LessonWithContext, Module, Lesson } from "./types";

export * from "./types";

// Ordered beginner → advanced: foundations first, cloud/orchestration/security last
export const tracks: Track[] = [
  linuxTrack,             // 01 Foundation
  linuxNetworkingTrack,   // 02 Foundation
  scriptingTrack,         // 03 Foundation
  sshProtocolsTrack,      // 04 Foundation
  gitTrack,               // 05 Version control
  githubActionsTrack,     // 06 CI/CD
  pythonTrack,            // 07 Programming
  dockerTrack,            // 08 Containers
  databasesTrack,         // 09 Databases
  webTechnologyTrack,     // 10 Web layer
  sdlcTrack,              // 11 SDLC
  terraformTrack,         // 12 IaC
  awsTrack,               // 13 Cloud
  kubernetesTrack,        // 14 Orchestration
  devsecopsTrack,         // 15 Advanced security/ops
  troubleshootingTrack,   // 16 Advanced debugging
  complianceTrack,        // 17 Governance
  promptEngineeringTrack, // 18 AI
];

export function getTrack(trackId: string): Track | undefined {
  return tracks.find((t) => t.id === trackId);
}

export function getModule(trackId: string, moduleId: string): { track: Track; module: Module } | undefined {
  const track = getTrack(trackId);
  if (!track) return undefined;
  const module = track.modules.find((m) => m.id === moduleId);
  if (!module) return undefined;
  return { track, module };
}

export function getLessonWithContext(
  trackId: string,
  moduleId: string,
  lessonId: string
): LessonWithContext | undefined {
  const track = getTrack(trackId);
  if (!track) return undefined;

  const module = track.modules.find((m) => m.id === moduleId);
  if (!module) return undefined;

  const lesson = module.lessons.find((l) => l.id === lessonId);
  if (!lesson) return undefined;

  // Build a flat list of all lessons across all modules for prev/next
  const allLessons: Array<{ trackId: string; moduleId: string; lessonId: string; title: string }> = [];
  for (const m of track.modules) {
    for (const l of m.lessons) {
      allLessons.push({ trackId: track.id, moduleId: m.id, lessonId: l.id, title: l.title });
    }
  }

  const idx = allLessons.findIndex(
    (l) => l.moduleId === moduleId && l.lessonId === lessonId
  );

  return {
    lesson,
    module,
    track,
    prevLesson: idx > 0 ? allLessons[idx - 1] : null,
    nextLesson: idx < allLessons.length - 1 ? allLessons[idx + 1] : null,
  };
}

export function getTotalLessons(track: Track): number {
  return track.modules.reduce((sum, m) => sum + m.lessons.length, 0);
}

export function getTotalDuration(track: Track): number {
  return track.modules.reduce(
    (sum, m) => sum + m.lessons.reduce((s, l) => s + l.duration, 0),
    0
  );
}

export function searchLessons(query: string): Array<{
  track: Track;
  module: Module;
  lesson: Lesson;
  excerpt: string;
}> {
  const q = query.toLowerCase();
  const results: Array<{ track: Track; module: Module; lesson: Lesson; excerpt: string }> = [];

  for (const track of tracks) {
    for (const module of track.modules) {
      for (const lesson of module.lessons) {
        const titleMatch = lesson.title.toLowerCase().includes(q);
        const descMatch = lesson.description.toLowerCase().includes(q);
        const contentMatch = lesson.content.toLowerCase().includes(q);

        if (titleMatch || descMatch || contentMatch) {
          const idx = lesson.content.toLowerCase().indexOf(q);
          const excerpt =
            idx >= 0
              ? "..." + lesson.content.slice(Math.max(0, idx - 60), idx + 100).replace(/[#*`]/g, "") + "..."
              : lesson.description;

          results.push({ track, module, lesson, excerpt });
        }
      }
    }
  }

  return results.slice(0, 20);
}
