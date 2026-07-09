import { prisma } from "../../../lib/prisma";

const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

// Basic server-side validation. Runs no matter what the browser sent.
function validateNoticeInput(body) {
  const errors = [];

  if (!body.title || typeof body.title !== "string" || !body.title.trim()) {
    errors.push("Title is required.");
  }
  if (!body.body || typeof body.body !== "string" || !body.body.trim()) {
    errors.push("Body is required.");
  }
  if (!CATEGORIES.includes(body.category)) {
    errors.push(`Category must be one of: ${CATEGORIES.join(", ")}.`);
  }
  if (!PRIORITIES.includes(body.priority)) {
    errors.push(`Priority must be one of: ${PRIORITIES.join(", ")}.`);
  }
  if (!body.publishDate || isNaN(new Date(body.publishDate).getTime())) {
    errors.push("publishDate must be a valid date.");
  }

  return errors;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      // Urgent-first ordering is done here, in the database query,
      // not by sorting an array in the browser.
      const notices = await prisma.notice.findMany({
        orderBy: [{ priority: "desc" }, { publishDate: "desc" }],
      });
      // Note: in the schema, enum Priority is declared as { Normal, Urgent }.
      // MySQL ENUM columns sort by declaration order, so "desc" puts
      // Urgent (declared later) before Normal. This is verified manually
      // after seeding sample data — see README.
      return res.status(200).json(notices);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch notices." });
    }
  }

  if (req.method === "POST") {
    const errors = validateNoticeInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const notice = await prisma.notice.create({
        data: {
          title: req.body.title.trim(),
          body: req.body.body.trim(),
          category: req.body.category,
          priority: req.body.priority,
          publishDate: new Date(req.body.publishDate),
          image: req.body.image ? req.body.image.trim() : null,
        },
      });
      return res.status(201).json(notice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to create notice." });
    }
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
