'use server';

import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import cloudinary from "@/lib/cloudinary";
import { Readable } from "stream";

const ArtworkSchema = z.object({
  title: z.string().min(1),
  description: z.string(),
  tags: z.array(z.string()),
});

export async function uploadArtwork(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const file = formData.get("file") as File;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const tagsJson = formData.get("tags") as string;

  if (!file) return { error: "No file provided" };

  try {
    const tags = JSON.parse(tagsJson) as string[];
    const validatedData = ArtworkSchema.parse({ title, description, tags });

    // Upload to Cloudinary
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadResult = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: "portfolio_uploads" },
            (error, result) => {
                if (error) reject(error);
                else resolve(result);
            }
        );
        const readable = new Readable();
        readable.push(buffer);
        readable.push(null);
        readable.pipe(stream);
    });

    const imageUrl = uploadResult.secure_url;

    // Create DB Entry
    const artwork = await db.artwork.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        imageUrl,
        userId: session.user.id,
      },
    });

    // Handle Tags
    for (const tagName of validatedData.tags) {
      const tag = await db.tag.upsert({
        where: { name: tagName },
        update: { count: { increment: 1 } },
        create: { name: tagName, count: 1 },
      });

      await db.artworkTag.create({
        data: {
          artworkId: artwork.id,
          tagId: tag.id,
        },
      });
    }

    revalidatePath("/");
    revalidatePath("/admin/manage");
    return { success: true, artwork };
  } catch (error) {
    console.error("Upload error:", error);
    return { error: "Upload failed" };
  }
}

export async function getArtworks(filter?: { userId?: string; tagIds?: string[] }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (filter?.userId) {
    where.userId = filter.userId;
  }

  if (filter?.tagIds && filter.tagIds.length > 0) {
    where.tags = {
      some: {
        tagId: { in: filter.tagIds },
      },
    };
  }

  return await db.artwork.findMany({
    where,
    include: {
      tags: { include: { tag: true } },
      user: { select: { name: true, username: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function deleteArtwork(id: string) {
    const session = await auth();
    if (!session?.user?.id) return { error: "Unauthorized" };

    const artwork = await db.artwork.findUnique({ where: { id } });
    if (!artwork || artwork.userId !== session.user.id) {
        return { error: "Unauthorized or not found" };
    }

    // Decrement tag counts
    const artworkTags = await db.artworkTag.findMany({ where: { artworkId: id } });
    for (const at of artworkTags) {
        await db.tag.update({
            where: { id: at.tagId },
            data: { count: { decrement: 1 } }
        });
    }

    await db.artwork.delete({ where: { id } });
    revalidatePath("/admin/manage");
    revalidatePath("/");
    return { success: true };
}
