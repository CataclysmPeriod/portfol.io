import { db } from "@/lib/db";
import { getArtworks } from "@/app/actions/artwork";
import Gallery from "@/app/components/Gallery";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function UserProfile({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  // Find user
  const user = await db.user.findUnique({
    where: { username },
  });

  if (!user) {
    notFound();
  }

  // Get user's artworks
  const artworks = await getArtworks({ userId: user.id });

  // Calculate stats
  const totalArtworks = artworks.length;
  // Get unique tags used by this user
  const userTagIds = new Set<string>();
  artworks.forEach(a => a.tags.forEach(t => userTagIds.add(t.tag.name)));
  const uniqueTags = Array.from(userTagIds);

  return (
    <div className="min-h-screen">
      {/* Profile Header */}
      <div className="h-[40vh] bg-gradient-to-b from-cyan/10 to-navy flex flex-col items-center justify-center p-8 text-center border-b border-white/10">
        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl mb-4 border border-white/20">
            {user.name?.[0]?.toUpperCase() || username[0].toUpperCase()}
        </div>
        <h1 className="text-4xl font-bold mb-2">{user.name || username}</h1>
        <p className="text-cyan font-mono mb-6">@{username}</p>
        
        <div className="flex gap-8 text-sm">
            <div>
                <span className="font-bold text-white block text-lg">{totalArtworks}</span>
                <span className="text-white/50">artworks</span>
            </div>
            <div>
                <span className="font-bold text-white block text-lg">{uniqueTags.length}</span>
                <span className="text-white/50">tags</span>
            </div>
        </div>
      </div>

      {/* User's Gallery */}
      <div className="max-w-7xl mx-auto py-12 px-4">
        {artworks.length > 0 ? (
            <Gallery artworks={artworks} />
        ) : (
            <div className="text-center text-white/50 py-20">
                this artist has not uploaded any works yet.
            </div>
        )}
      </div>
    </div>
  );
}
