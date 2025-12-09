import { getGlobalTags } from "@/app/actions/tag";
import { getArtworks } from "@/app/actions/artwork";
import HomeClient from "@/app/components/HomeClient";

export const dynamic = 'force-dynamic';

export default async function Page() {
  const tags = await getGlobalTags();
  const artworks = await getArtworks();

  return <HomeClient initialTags={tags} initialArtworks={artworks} />;
}
