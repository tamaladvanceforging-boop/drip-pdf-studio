"use client";
import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={cn(
        "grid md:auto-rows-[19rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  badge,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className={cn(
        "row-span-1 rounded-2xl group/bento transition duration-200 p-5 bg-white dark:bg-zinc-900/80 border border-slate-200/90 dark:border-white/[0.08] hover:border-violet-500/50 hover:shadow-xl dark:hover:shadow-2xl shadow-sm dark:shadow-none justify-between flex flex-col space-y-4 cursor-pointer backdrop-blur-xl relative overflow-hidden text-slate-900 dark:text-zinc-100",
        className
      )}
    >
      {/* Subtle glowing radial background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 pointer-events-none" />

      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300 border border-violet-500/30">
            {badge}
          </span>
        </div>
      )}

      <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-200/80 dark:border-white/5 group-hover/bento:border-violet-500/20 transition-colors">
        {header}
      </div>

      <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
        <div className="flex items-center space-x-2 text-violet-600 dark:text-violet-400 mb-1.5">
          {icon}
          <div className="font-bold text-slate-900 dark:text-zinc-100 text-lg group-hover/bento:text-violet-600 dark:group-hover/bento:text-violet-300 transition-colors">
            {title}
          </div>
        </div>
        <div className="text-xs text-slate-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
