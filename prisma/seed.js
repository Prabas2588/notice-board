// Optional: run with `node prisma/seed.js` to add a few sample notices
// so you have something to look at right after deploying.
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.notice.createMany({
    data: [
      {
        title: "Mid-Semester Exam Schedule Released",
        body: "The mid-semester exam timetable has been published. Check the portal for your slot.",
        category: "Exam",
        priority: "Urgent",
        publishDate: new Date("2026-07-10"),
      },
      {
        title: "Annual Sports Day",
        body: "Join us for the annual sports day at the main ground. All students welcome.",
        category: "Event",
        priority: "Normal",
        publishDate: new Date("2026-07-15"),
      },
      {
        title: "Library Timings Updated",
        body: "The library will now remain open until 9 PM on weekdays.",
        category: "General",
        priority: "Normal",
        publishDate: new Date("2026-07-08"),
      },
    ],
  });
  console.log("Seeded sample notices.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
