"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { clsx } from "clsx";

interface Tag {
  id: string;
  name: string;
  count: number;
}

interface HeroProps {
  tags: Tag[];
  onSelectTag: (tag: string) => void;
  selectedTags: string[];
  isMultiSelect?: boolean;
  onToggleMultiSelect?: () => void;
}

export default function Hero({ tags, onSelectTag, selectedTags, isMultiSelect = true, onToggleMultiSelect }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const isCompact = selectedTags.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
       console.log("Searching for user:", searchQuery);
    }
  };

  return (
    <div className={clsx(
        "relative w-full transition-all duration-700 ease-in-out z-10",
        isCompact ? "h-20 border-b border-white/10" : "h-screen flex flex-col items-center justify-center"
    )}>
      <a href="/admin" className="fixed top-4 right-4 z-50 text-xs text-white/10 hover:text-white/50 transition-colors uppercase tracking-widest">
          Login
      </a>

      {/* Floating Background Tags */}
      <div className={clsx(
          "absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500",
          isCompact ? "opacity-0" : "opacity-100"
      )}>
      {tags.map((tag) => (
          <FloatingTag 
            key={tag.id} 
            tag={tag} 
            onClick={() => onSelectTag(tag.name)}
          />
        ))}
      </div>

      {/* Search Bar (Only visible when not compact) */}
      <AnimatePresence>
        {!isCompact && (
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="z-20 relative text-center"
            >
                <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight">welcome to portfol.io</h1>
                
                <form onSubmit={handleSearch} className="relative inline-block group">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan font-mono">/press tab</span>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="to find an artist"
                        className="bg-transparent border border-cyan/50 rounded-lg py-3 pl-32 pr-4 w-[400px] text-white focus:outline-none focus:border-cyan focus:shadow-[0_0_15px_rgba(0,194,255,0.3)] transition-all font-mono"
                    />
                </form>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Compact Header View of Selected Tags */}
      {isCompact && (
          <div className="absolute inset-0 flex items-center px-8 z-30">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full">
                  <span className="text-cyan font-bold whitespace-nowrap">portfol.io</span>
                  <div className="h-6 w-px bg-white/20 mx-2"></div>
                  
                  {selectedTags.map(tag => (
                      <button 
                        key={tag}
                        onClick={() => onSelectTag(tag)}
                        className="px-4 py-1.5 rounded-full border border-cyan bg-cyan/10 text-cyan text-sm whitespace-nowrap hover:bg-red-500/20 hover:border-red-500 hover:text-red-500 transition-colors group"
                      >
                        {tag} <span className="hidden group-hover:inline ml-1">×</span>
                      </button>
                  ))}

                  {/* Multi-select toggle */}
                  <div className="ml-auto flex items-center gap-2 cursor-pointer select-none" onClick={onToggleMultiSelect}>
                       <span className="text-xs text-white/50">{isMultiSelect ? "multi-select on" : "multi-select off"}</span>
                       <div className={clsx(
                           "w-8 h-4 rounded-full relative transition-colors",
                           isMultiSelect ? "bg-cyan/20" : "bg-white/10"
                       )}>
                            <div className={clsx(
                                "absolute top-0.5 w-3 h-3 rounded-full transition-all",
                                isMultiSelect ? "right-0.5 bg-cyan" : "left-0.5 bg-white/50"
                            )}></div>
                       </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
}

function FloatingTag({ tag, onClick }: { tag: Tag, onClick: () => void }) {
    // Randomize initial position
    // Use useEffect to ensure client-side only randomization (avoids hydration mismatch)
    const [config, setConfig] = useState({ x: 0, y: 0, durX: 20, durY: 15 });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setConfig({
            x: Math.random() * 80 - 40, 
            y: Math.random() * 80 - 40,
            durX: 20 + Math.random() * 10,
            durY: 15 + Math.random() * 10
        });
    }, []);

    // Size based on count (logarithmic scale usually better)
    const size = Math.min(1.5, 1 + Math.log(tag.count + 1) * 0.1);

    return (
        <motion.button
            layoutId={`tag-${tag.id}`}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
                opacity: 1, 
                scale: size,
                x: `${config.x}vw`,
                y: `${config.y}vh`,
            }}
            transition={{ 
                duration: 1,
                // Floating animation loop
                x: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: config.durX,
                    ease: "easeInOut"
                },
                y: {
                    repeat: Infinity,
                    repeatType: "reverse",
                    duration: config.durY,
                    ease: "easeInOut"
                }
            }}
            whileHover={{ scale: size * 1.1, zIndex: 50, borderColor: "var(--color-cyan)", color: "var(--color-cyan)" }}
            onClick={onClick}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-full border border-white/20 bg-navy/50 backdrop-blur-sm text-white/70 pointer-events-auto transition-colors z-0"
        >
            <span className="block">{tag.name}</span>
            <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] opacity-0 hover:opacity-100 transition-opacity">
                {tag.count}
            </span>
        </motion.button>
    )
}
