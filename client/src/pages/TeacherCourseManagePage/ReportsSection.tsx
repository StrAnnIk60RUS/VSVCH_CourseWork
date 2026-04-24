type Props = {
  courseId: string;
  status: string;
  onDownloadPdf: () => Promise<void>;
  onDownloadDocx: () => Promise<void>;
  onSendEmail: () => Promise<void>;
};

export function ReportsSection({ courseId, status, onDownloadPdf, onDownloadDocx, onSendEmail }: Props) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onDownloadPdf()} className="rounded border border-slate-300 px-3 py-2">
          PDF summary
        </button>
        <button type="button" onClick={() => onDownloadDocx()} className="rounded border border-slate-300 px-3 py-2">
          DOCX summary
        </button>
        <button type="button" onClick={() => onSendEmail()} className="rounded border border-slate-300 px-3 py-2">
          Отправить e-mail
        </button>
      </div>
      {status && <p className="mt-2 text-sm">{status}</p>}
      {!courseId && <p className="mt-2 text-sm text-slate-500">Идентификатор курса не указан.</p>}
    </>
  );
}
