import Link from "next/link";
import NoticeForm from "../../components/NoticeForm";

export default function NewNotice() {
  return (
    <div className="container">
      <div className="header">
        <h1>Add Notice</h1>
        <Link href="/" className="btn btn-secondary">
          Back
        </Link>
      </div>
      <NoticeForm />
    </div>
  );
}
