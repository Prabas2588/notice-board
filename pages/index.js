import { useEffect, useState } from "react";
import Link from "next/link";
import NoticeCard from "../components/NoticeCard";

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotices();
  }, []);

  async function fetchNotices() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/notices");
      if (!res.ok) throw new Error("Failed to load notices");
      const data = await res.json();
      setNotices(data);
    } catch (err) {
      setError("Could not load notices. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }

  function handleDeleted(id) {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Notice Board</h1>
        <Link href="/notices/new" className="btn btn-primary">
          + Add Notice
        </Link>
      </div>

      {loading && <div className="loading">Loading notices…</div>}
      {error && <div className="error-box">{error}</div>}

      {!loading && !error && notices.length === 0 && (
        <div className="empty-state">No notices yet. Add the first one!</div>
      )}

      {!loading && !error && notices.length > 0 && (
        <div className="notice-grid">
          {notices.map((notice) => (
            <NoticeCard key={notice.id} notice={notice} onDeleted={handleDeleted} />
          ))}
        </div>
      )}
    </div>
  );
}
