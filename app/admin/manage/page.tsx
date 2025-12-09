import { auth } from "@/lib/auth";
import { getArtworks, deleteArtwork } from "@/app/actions/artwork";
import Image from "next/image";
import Link from "next/link";
import { Edit2, Trash2 } from "lucide-react";
import DeleteButton from "@/app/components/DeleteButton";

export default async function ManagePage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const artworks = await getArtworks({ userId: session.user.id });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">manage artworks</h1>
        <Link 
            href="/admin/upload"
            className="px-4 py-2 bg-white/10 rounded hover:bg-cyan hover:text-navy transition-colors text-sm"
        >
            + new upload
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {artworks.map((artwork) => (
          <div key={artwork.id} className="group relative border border-white/10 rounded-lg overflow-hidden bg-white/5">
            <div className="aspect-[4/3] relative">
              <Image
                src={artwork.imageUrl}
                alt={artwork.title}
                fill
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-navy/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                 {/* 
                    Note: Edit functionality would ideally open the modal. 
                    For now we just show the structure. 
                 */}
                 <button className="p-2 bg-white/10 rounded-full hover:bg-cyan hover:text-navy transition-colors">
                    <Edit2 size={20} />
                 </button>
                 <DeleteButton id={artwork.id} />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold truncate">{artwork.title}</h3>
              <div className="flex gap-2 mt-2 overflow-hidden">
                {artwork.tags.slice(0, 3).map(({ tag }) => (
                    <span key={tag.id} className="text-xs text-white/50 border border-white/20 px-2 py-0.5 rounded-full">
                        {tag.name}
                    </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {artworks.length === 0 && (
            <div className="col-span-full text-center py-20 text-white/50">
                no artworks yet. start uploading!
            </div>
        )}
      </div>
    </div>
  );
}
