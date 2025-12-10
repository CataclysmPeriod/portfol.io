"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Artwork, Tag } from "@prisma/client";
import { useState } from "react";
import { X } from "lucide-react";

interface GalleryProps {
  artworks: (Artwork & { tags: { tag: Tag }[], user: { name: string | null, username: string } })[];
}

export default function Gallery({ artworks }: GalleryProps) {
  const [selectedArtwork, setSelectedArtwork] = useState<string | null>(null);

  const activeArtwork = artworks.find(a => a.id === selectedArtwork);

  return (
    <>
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 p-8 space-y-6">
        {artworks.map((artwork, i) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="break-inside-avoid relative group cursor-pointer"
            onClick={() => setSelectedArtwork(artwork.id)}
          >
            <div className="relative rounded-lg overflow-hidden border border-white/10 bg-white/5">
                <Image
                    src={artwork.imageUrl}
                    alt={artwork.title}
                    width={500}
                    height={500} // Aspect ratio handled by CSS usually, but NextImage needs dims. We'll use style.
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 select-none"
                    onContextMenu={(e) => e.preventDefault()}
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                    <h3 className="font-bold text-lg translate-y-2 group-hover:translate-y-0 transition-transform">{artwork.title}</h3>
                    <p className="text-sm text-cyan translate-y-2 group-hover:translate-y-0 transition-transform delay-75">
                        @{artwork.user.username}
                    </p>
                </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Artwork Modal */}
      {selectedArtwork && activeArtwork && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
              <div 
                className="absolute inset-0 bg-navy/80 backdrop-blur-md" 
                onClick={() => setSelectedArtwork(null)}
              ></div>
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative bg-navy w-full max-w-6xl max-h-[90vh] rounded-2xl border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-2xl"
              >
                  <button 
                    onClick={() => setSelectedArtwork(null)}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-white hover:text-navy transition-colors"
                  >
                      <X size={24} />
                  </button>

                  {/* Image Side */}
                  <div className="md:w-2/3 bg-black/50 relative flex items-center justify-center p-4">
                      <Image
                        src={activeArtwork.imageUrl}
                        alt={activeArtwork.title}
                        fill
                        className="object-contain select-none"
                        onContextMenu={(e) => e.preventDefault()}
                      />
                  </div>

                  {/* Details Side */}
                  <div className="md:w-1/3 p-8 overflow-y-auto bg-white text-navy flex flex-col">
                        <div className="mb-auto">
                            <h2 className="text-3xl font-bold mb-2">{activeArtwork.title}</h2>
                            <p className="text-sm text-gray-500 mb-6 font-mono">
                                by <span className="text-cyan font-bold cursor-pointer hover:underline">@{activeArtwork.user.username}</span> • {new Date(activeArtwork.createdAt).toLocaleDateString()}
                            </p>
                            
                            <div className="prose prose-sm max-w-none mb-8" dangerouslySetInnerHTML={{ __html: activeArtwork.description }} />
                        </div>

                        <div className="flex flex-wrap gap-2 pt-8 border-t border-gray-200">
                            {activeArtwork.tags.map(({ tag }) => (
                                <span key={tag.id} className="px-3 py-1 rounded-full border border-navy/20 text-xs font-medium hover:bg-navy hover:text-white transition-colors cursor-pointer">
                                    {tag.name}
                                </span>
                            ))}
                        </div>
                  </div>
              </motion.div>
          </div>
      )}
    </>
  );
}
