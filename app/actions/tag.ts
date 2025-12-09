'use server';

import { db } from "@/lib/db";

export async function getGlobalTags() {
  return await db.tag.findMany({
    orderBy: { count: "desc" },
    take: 50, // Limit to top 50 mostly used tags
  });
}

export async function searchTags(query: string) {
    if (!query) return [];
    return await db.tag.findMany({
        where: {
            name: { contains: query }
        },
        take: 5,
    });
}
