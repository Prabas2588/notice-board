import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import NoticeForm from "../../../components/NoticeForm";

export default function EditNotice() {
  const router = useRouter();
  const { id } = router.query;

  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    async function fetchNotice() {
      try {
        const res = await fetch(`/api/notices/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setNotice(data);
      } catch (err) {
        setError("Could not load this notice.");
      } finally {
        setLoading(false);
      }
    }

    fetchNotice();
  }, [id]);

  return (
    <div className="container">
      <div className="header">
        <h1>Edit Notice</h1>
        <Link href="/" className="btn btn-secondary">
          Back
        </Link>
      </div>

      {loading && <div className="loading">Loading…</div>}
      {error && <div className="error-box">{error}</div>}
      {!loading && !error && notice && <NoticeForm initialNotice={notice} noticeId={id} />}
    </div>
  );
}
