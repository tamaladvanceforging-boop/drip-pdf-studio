"use client";
import React from "react";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute inset-0 overflow-hidden pointer-events-none [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] opacity-60 dark:opacity-100",
        className
      )}
    >
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-tr from-violet-500/10 dark:from-violet-600/20 via-fuchsia-500/10 to-cyan-400/15 dark:to-cyan-400/20 blur-[120px] rounded-full" />
      <div className="absolute top-1/2 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/10 dark:from-blue-600/15 via-indigo-500/5 dark:via-indigo-500/10 to-transparent blur-[140px] rounded-full" />
      <div className="absolute -bottom-40 right-0 w-[700px] h-[700px] bg-gradient-to-tr from-purple-500/10 dark:from-purple-600/15 via-pink-500/5 dark:via-pink-500/10 to-transparent blur-[140px] rounded-full" />
    </div>
  );
};
