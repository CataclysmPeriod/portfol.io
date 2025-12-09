"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
}

export default function Hero({ tags, onSelectTag, selectedTags }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // If tags are selected, the Hero collapses into a header (handled by parent layout state usually, 
  // but here we are designing the component behavior).
  // Actually, per plan, clicking a tag transitions the view.
  
  const isCompact = selectedTags.length > 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
       // Search for user/artist
       // For now, let's just log or redirect
       console.log("Searching for user:", searchQuery);
    }
  };

  return (
    <div className={clsx(
        "relative w-full transition-all duration-700 ease-in-out z-10",
        isCompact ? "h-20 border-b border-white/10" : "h-screen flex flex-col items-center justify-center"
    )}>
      {/* Floating Background Tags */}
      <div className={clsx(
          "absolute inset-0 overflow-hidden pointer-events-none transition-opacity duration-500",
          isCompact ? "opacity-0" : "opacity-100"
      )}>
        {tags.map((tag, i) => (
          <FloatingTag 
            key={tag.id} 
            tag={tag} 
            index={i} 
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

                  {/* Add more tags toggle or dropdown could go here */}
                  <div className="ml-auto flex items-center gap-2">
                       {/* Multi-select toggle placeholder */}
                       <span className="text-xs text-white/50">multi-select on</span>
                       <div className="w-8 h-4 bg-cyan/20 rounded-full relative cursor-pointer">
                            <div className="absolute right-0.5 top-0.5 w-3 h-3 bg-cyan rounded-full"></div>
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
    const [config, setConfig] = useState({ 
        x: 0, 
        y: 0,
        durX: 20,
        durY: 15
    });
    
    useEffect(() => {
        setConfig({
            x: Math.random() * 80 - 40, // percentage offset
            y: Math.random() * 80 - 40,
            durX: 20 + Math.random() * 10,
            durY: 15 + Math.random() * 10
        })
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
