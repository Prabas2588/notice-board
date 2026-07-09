import { useState } from "react";
import { useRouter } from "next/router";

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
}

export default function NoticeCard({ notice, onDeleted }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/notices/${notice.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      onDeleted(notice.id);
    } catch (err) {
      alert("Could not delete this notice. Please try again.");
    } finally {
      setDeleting(false);
      setConfirming(false);
    }
  }

  const isUrgent = notice.priority === "Urgent";

  return (
    <div className={`card ${isUrgent ? "urgent" : ""}`}>
      <div className="card-top">
        <h3 className="card-title">{notice.title}</h3>
        {isUrgent && <span className="badge badge-urgent">Urgent</span>}
      </div>

      <span className="badge badge-category">{notice.category}</span>

      {notice.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={notice.image} alt={notice.title} className="card-image" />
      )}

      <p className="card-body">{notice.body}</p>
      <div className="card-meta">Published: {formatDate(notice.publishDate)}</div>

      <div className="card-actions">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => router.push(`/notices/edit/${notice.id}`)}
        >
          Edit
        </button>
        <button className="btn btn-danger btn-sm" onClick={() => setConfirming(true)}>
          Delete
        </button>
      </div>

      {confirming && (
        <div className="modal-overlay" onClick={() => !deleting && setConfirming(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <p>Delete "{notice.title}"? This can't be undone.</p>
            <div className="modal-actions">
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setConfirming(false)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
