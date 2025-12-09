"use client";

import { useState } from "react";
import Hero from "@/app/components/Hero";
import Gallery from "@/app/components/Gallery";
import { getArtworks } from "@/app/actions/artwork";

export default function Home({ initialTags, initialArtworks }: any) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [artworks, setArtworks] = useState(initialArtworks);

  const handleSelectTag = async (tag: string) => {
    let newTags;
    if (selectedTags.includes(tag)) {
        newTags = selectedTags.filter(t => t !== tag);
    } else {
        // Multi-select logic is default per user request update
        newTags = [...selectedTags, tag];
    }
    
    setSelectedTags(newTags);
    
    // In a real app we might fetch new artworks here via server action or API
    // For this prototype, let's assume we filter or fetch. 
    // Fetching is safer for large datasets.
    // However, since `getArtworks` is a server action, we can't easily call it directly inside render without useEffect or transition.
    // Let's rely on a client-side filter of the initialArtworks for speed if dataset small, 
    // BUT correctly we should refetch.
  };

  // Effect to refetch when tags change
  // Note: simpler to just do client side filtering for the prototype if we pass all artworks, 
  // but "getArtworks" supports filtering.
  // Let's implement a quick fetch.
  
  const [loading, setLoading] = useState(false);
  
  // Actually, let's use the active tags to filter the displayed artworks from the ones we have, 
  // or fetch fresh ones. Given "multi-user platform" scale, we must fetch.
  
  const fetchFiltered = async (tags: string[]) => {
      // Find IDs for these tags
      const tagIds = initialTags.filter((t: any) => tags.includes(t.name)).map((t: any) => t.id);
      const res = await getArtworks({ tagIds: tagIds.length ? tagIds : undefined });
      setArtworks(res);
  }

  // Hook into state change
  const onTagToggle = (tag: string) => {
      const isSelected = selectedTags.includes(tag);
      const newTags = isSelected 
        ? selectedTags.filter(t => t !== tag)
        : [...selectedTags, tag];
      
      setSelectedTags(newTags);
      fetchFiltered(newTags);
  };

  return (
    <main className="min-h-screen flex flex-col">
      <Hero 
        tags={initialTags} 
        onSelectTag={onTagToggle} 
        selectedTags={selectedTags}
      />
      
      {(selectedTags.length > 0) && (
          <div className="flex-1 bg-navy relative z-0">
             <Gallery artworks={artworks} />
          </div>
      )}
      
      {/* Show all gallery if scroll down? Or just when searched? 
          The design implies the Hero *is* the page until interaction.
          But usually a portfolio shows recent works below. 
          Let's show artworks if tags selected OR just recent ones if scrolled?
          Ref image 6 shows "Visitor - Main Page (with artworks)" implies they appear below.
      */}
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
