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
        "row-span-1 rounded-2xl group/bento hover:shadow-2xl transition duration-200 shadow-input dark:shadow-none p-5 bg-zinc-900/70 border border-white/[0.08] hover:border-violet-500/50 justify-between flex flex-col space-y-4 cursor-pointer backdrop-blur-xl relative overflow-hidden",
        className
      )}
    >
      {/* Subtle glowing radial background on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 via-transparent to-transparent opacity-0 group-hover/bento:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
            {badge}
          </span>
        </div>
      )}

      <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-xl bg-zinc-950/60 border border-white/5 group-hover/bento:border-violet-500/20 transition-colors">
        {header}
      </div>

      <div className="group-hover/bento:translate-x-1 transition duration-200 relative z-10">
        <div className="flex items-center space-x-2 text-violet-400 mb-1.5">
          {icon}
          <div className="font-bold text-zinc-100 text-lg group-hover/bento:text-violet-300 transition-colors">
            {title}
          </div>
        </div>
        <div className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
          {description}
        </div>
      </div>
    </motion.div>
  );
};
