import { prisma } from "../../../lib/prisma";

const CATEGORIES = ["Exam", "Event", "General"];
const PRIORITIES = ["Normal", "Urgent"];

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
  const { id } = req.query;
  const noticeId = parseInt(id, 10);

  if (isNaN(noticeId)) {
    return res.status(400).json({ error: "Invalid notice id." });
  }

  if (req.method === "GET") {
    try {
      const notice = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!notice) return res.status(404).json({ error: "Notice not found." });
      return res.status(200).json(notice);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to fetch notice." });
    }
  }

  if (req.method === "PUT") {
    const errors = validateNoticeInput(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ error: "Notice not found." });

      const updated = await prisma.notice.update({
        where: { id: noticeId },
        data: {
          title: req.body.title.trim(),
          body: req.body.body.trim(),
          category: req.body.category,
          priority: req.body.priority,
          publishDate: new Date(req.body.publishDate),
          image: req.body.image ? req.body.image.trim() : null,
        },
      });
      return res.status(200).json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to update notice." });
    }
  }

  if (req.method === "DELETE") {
    try {
      const existing = await prisma.notice.findUnique({ where: { id: noticeId } });
      if (!existing) return res.status(404).json({ error: "Notice not found." });

      await prisma.notice.delete({ where: { id: noticeId } });
      return res.status(204).end();
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Failed to delete notice." });
    }
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  return res.status(405).json({ error: `Method ${req.method} not allowed.` });
}
