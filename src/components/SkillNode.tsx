import React, { type FC } from 'react';
import { motion } from 'motion/react';
import { Lock, Check, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { Node } from '../types';

interface SkillNodeProps {
  node: Node;
  onClick: (node: Node) => void;
}

const SkillNode: FC<SkillNodeProps> = ({ node, onClick }) => {
  const isLocked = node.status === 'locked';
  const isCompleted = node.status === 'completed';

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.05 }}
      className="relative flex flex-col items-center gap-3"
      style={{
        gridColumn: `span 1`,
        transform: `translate(${node.position.x}px, ${node.position.y}px)`
      }}
    >
      <button
        onClick={() => !isLocked && onClick(node)}
        disabled={isLocked}
        className={cn(
          "relative flex h-20 w-20 items-center justify-center rounded-full border-4 transition-all duration-300",
          isLocked 
            ? "border-white/10 bg-white/5 text-white/20 cursor-not-allowed" 
            : isCompleted
              ? "border-primary bg-primary text-background glow-gold"
              : "border-primary/40 bg-surface text-primary hover:border-primary hover:glow-gold"
        )}
      >
        {isLocked ? (
          <Lock size={24} />
        ) : isCompleted ? (
          <Check size={28} strokeWidth={3} />
        ) : (
          <Play size={24} fill="currentColor" className="ml-1" />
        )}

        {!isLocked && !isCompleted && (
          <svg className="absolute -inset-2 h-24 w-24 -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="44"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeDasharray={2 * Math.PI * 44}
              strokeDashoffset={2 * Math.PI * 44 * (1 - node.progress / 100)}
              className="text-primary/20"
            />
          </svg>
        )}
      </button>

      <div className="text-center">
        <span className={cn(
          "text-xs font-bold uppercase tracking-widest",
          isLocked ? "text-white/20" : "text-white/60"
        )}>
          {node.topic}
        </span>
        <h3 className={cn(
          "text-sm font-bold",
          isLocked ? "text-white/20" : "text-white"
        )}>
          {node.title}
        </h3>
      </div>
    </motion.div>
  );
};

export default SkillNode;
