const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const TAGS = [
  "Digital", "Oil", "3D", "Abstract", "Portrait", 
  "Landscape", "Cyberpunk", "Minimalist", "Surrealism", 
  "Photography", "Concept Art", "Character Design", 
  "Illustration", "Pixel Art", "Watercolor"
];

async function main() {
  console.log("Seeding content...");

  // 1. Create Admin User (if not exists)
  // Assumes user created by previous seed, but we can fetch it.
  const user = await prisma.user.findUnique({
    where: { email: 'admin@example.com' }
  });

  if (!user) {
    console.error("Admin user not found. Please run scripts/seed.js first.");
    return;
  }

  // 2. Create Tags
  console.log("Creating tags...");
  const tagRecords = [];
  for (const name of TAGS) {
    const tag = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name, count: Math.floor(Math.random() * 10) }, // Random initial popularity
    });
    tagRecords.push(tag);
  }

  // 3. Create Dummy Artworks
  console.log("Creating artworks...");
  const artworks = [
    {
      title: "Neon City",
      description: "<p>A <strong>cyberpunk</strong> cityscape exploration.</p>",
      tags: ["Cyberpunk", "Digital", "3D"],
      imageUrl: "/window.svg" // Placeholder from public folder
    },
    {
      title: "Silent Hills",
      description: "<p><em>Misty</em> landscapes in the morning.</p>",
      tags: ["Landscape", "Photography", "Minimalist"],
      imageUrl: "/globe.svg"
    },
    {
      title: "Abstract Mind",
      description: "<p>An exploration of <u>color and form</u>.</p>",
      tags: ["Abstract", "Oil", "Surrealism"],
      imageUrl: "/file.svg"
    },
    {
      title: "Character Study 01",
      description: "<p>Drafting a new protagonist.</p>",
      tags: ["Character Design", "Illustration", "Digital"],
      imageUrl: "/next.svg"
    },
    {
      title: "Pixel Hero",
      description: "<p>Retro game asset.</p>",
      tags: ["Pixel Art", "Digital"],
      imageUrl: "/vercel.svg"
    }
  ];

  for (const art of artworks) {
    const createdArt = await prisma.artwork.create({
      data: {
        title: art.title,
        description: art.description,
        imageUrl: art.imageUrl,
        userId: user.id,
        tags: {
            create: art.tags.map(tagName => {
                const tag = tagRecords.find(t => t.name === tagName);
                return {
                    tag: { connect: { id: tag.id } }
                };
            })
        }
      }
    });
    
    // Update tag counts
    for (const tagName of art.tags) {
        await prisma.tag.update({
            where: { name: tagName },
            data: { count: { increment: 1 } }
        });
    }
    console.log(`Created artwork: ${art.title}`);
  }

  console.log("Seeding complete.");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
