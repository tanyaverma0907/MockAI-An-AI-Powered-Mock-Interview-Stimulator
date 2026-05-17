

import React from "react";

interface LiveHintProps {
  hint: string;
  visible: boolean;
}

export const LiveHint: React.FC<LiveHintProps> = ({ hint, visible }) => {
  return (
    <div
      className="overflow-hidden transition-all duration-500"
      style={{ maxHeight: visible ? "64px" : "0", opacity: visible ? 1 : 0 }}
    >
      <div className="flex items-center gap-2.5 px-3 py-2.5 mt-2 rounded-xl border border-amber-500/20 bg-amber-500/5">
        <span className="text-amber-400 text-sm shrink-0">💡</span>
        <span className="text-amber-300/80 text-xs font-semibold leading-snug tracking-wide">
          {hint}
        </span>
      </div>
    </div>
  );
};