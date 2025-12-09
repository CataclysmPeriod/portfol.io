"use client";

import { useState, useEffect } from "react";
import Hero from "@/app/components/Hero";
import Gallery from "@/app/components/Gallery";
import { getArtworks } from "@/app/actions/artwork";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function Home({ initialTags, initialArtworks }: { initialTags: any[], initialArtworks: any[] }) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [artworks, setArtworks] = useState(initialArtworks);
  const [isMultiSelect, setIsMultiSelect] = useState(true);

  const fetchFiltered = async (tags: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const tagIds = initialTags.filter((t: any) => tags.includes(t.name)).map((t: any) => t.id);
      const res = await getArtworks({ tagIds: tagIds.length ? tagIds : undefined });
      setArtworks(res);
  }

  const onTagToggle = (tag: string) => {
      const isSelected = selectedTags.includes(tag);
      let newTags: string[];

      if (isMultiSelect) {
          // In multi-select, we toggle
          newTags = isSelected 
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];
      } else {
          // In single select, clicking a new tag replaces selection
          // Clicking the same tag toggles it off
          newTags = isSelected ? [] : [tag];
      }
      
      setSelectedTags(newTags);
      fetchFiltered(newTags);
  };

  // Scroll to top revert logic
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
        // If scrolling UP (deltaY < 0) and at TOP (scrollY === 0) and in COMPACT mode
        // -10 is a threshold to avoid accidental micro-scrolls
        if (e.deltaY < -10 && window.scrollY === 0 && selectedTags.length > 0) {
            setSelectedTags([]); 
            fetchFiltered([]);
        }
    };

    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [selectedTags]);

  return (
    <main className="min-h-screen flex flex-col">
      <Hero 
        tags={initialTags} 
        onSelectTag={onTagToggle} 
        selectedTags={selectedTags}
        isMultiSelect={isMultiSelect}
        onToggleMultiSelect={() => setIsMultiSelect(!isMultiSelect)}
      />
      
      {(selectedTags.length > 0) && (
          <div className="flex-1 bg-navy relative z-0">
             <Gallery artworks={artworks} />
          </div>
      )}
      
      {selectedTags.length === 0 && (
          <div className="flex-1 bg-navy relative z-0 mt-[20vh]">
              <div className="text-center text-white/30 text-sm mb-8">
                  scroll or select a tag to explore
              </div>
               <Gallery artworks={artworks} />
          </div>
      )}
    </main>
  );
}
