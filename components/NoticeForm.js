import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORIES = ["Exam", "Event", "General"];

function toDateInputValue(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function NoticeForm({ initialNotice, noticeId }) {
  const router = useRouter();
  const isEditing = Boolean(noticeId);

  const [title, setTitle] = useState(initialNotice?.title || "");
  const [body, setBody] = useState(initialNotice?.body || "");
  const [category, setCategory] = useState(initialNotice?.category || "General");
  const [priority, setPriority] = useState(initialNotice?.priority || "Normal");
  const [publishDate, setPublishDate] = useState(toDateInputValue(initialNotice?.publishDate));
  const [image, setImage] = useState(initialNotice?.image || "");

  const [errors, setErrors] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors([]);

    // Light client-side check for a fast UX; the API route re-validates
    // everything server-side regardless of what happens here.
    const clientErrors = [];
    if (!title.trim()) clientErrors.push("Title is required.");
    if (!body.trim()) clientErrors.push("Body is required.");
    if (!publishDate) clientErrors.push("Publish date is required.");
    if (clientErrors.length > 0) {
      setErrors(clientErrors);
      return;
    }

    setSubmitting(true);
    const payload = { title, body, category, priority, publishDate, image };

    try {
      const res = await fetch(isEditing ? `/api/notices/${noticeId}` : "/api/notices", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors(data.errors || [data.error || "Something went wrong."]);
        setSubmitting(false);
        return;
      }

      router.push("/");
    } catch (err) {
      setErrors(["Network error. Please try again."]);
      setSubmitting(false);
    }
  }

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <div className="error-box">
          {errors.map((err, i) => (
            <div key={i}>{err}</div>
          ))}
        </div>
      )}

      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="body">Body *</label>
        <textarea id="body" value={body} onChange={(e) => setBody(e.target.value)} />
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Priority</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="priority"
              value="Normal"
              checked={priority === "Normal"}
              onChange={() => setPriority("Normal")}
            />
            Normal
          </label>
          <label>
            <input
              type="radio"
              name="priority"
              value="Urgent"
              checked={priority === "Urgent"}
              onChange={() => setPriority("Urgent")}
            />
            Urgent
          </label>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="publishDate">Publish Date *</label>
        <input
          id="publishDate"
          type="date"
          value={publishDate}
          onChange={(e) => setPublishDate(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="image">Image URL (optional)</label>
        <input
          id="image"
          type="url"
          placeholder="https://example.com/image.jpg"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving…" : isEditing ? "Save Changes" : "Create Notice"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push("/")}
          disabled={submitting}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
