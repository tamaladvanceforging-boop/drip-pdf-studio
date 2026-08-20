import React from "react";
import { LucideIcon } from "lucide-react";

interface ToolHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  badge?: string;
}

export const ToolHeader: React.FC<ToolHeaderProps> = ({
  icon: Icon,
  title,
  description,
  badge = "100% Client-Side",
}) => {
  return (
    <div className="text-center space-y-3 mb-8">
      <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-violet-500/10 dark:bg-violet-500/20 border border-violet-500/20 text-violet-700 dark:text-violet-300 text-xs font-semibold shadow-sm">
        <Icon className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
        <span>{badge}</span>
      </div>
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-zinc-100">
        {title}
      </h1>
      <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xl mx-auto leading-relaxed">
        {description}
      </p>
    </div>
  );
};
