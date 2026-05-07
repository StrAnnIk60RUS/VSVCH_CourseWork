import { useI18n } from '../../hooks/useI18n';

type Props = {
  courseId: string;
  status: string;
  onDownloadPdf: () => Promise<void>;
  onDownloadDocx: () => Promise<void>;
  onSendEmail: () => Promise<void>;
};

export function ReportsSection({ courseId, status, onDownloadPdf, onDownloadDocx, onSendEmail }: Props) {
  const t = useI18n();
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => onDownloadPdf()} className="ui-btn-secondary">
          {t.teacherReports.pdfSummary}
        </button>
        <button type="button" onClick={() => onDownloadDocx()} className="ui-btn-secondary">
          {t.teacherReports.docxSummary}
        </button>
        <button type="button" onClick={() => onSendEmail()} className="ui-btn-primary">
          {t.teacherReports.sendEmail}
        </button>
      </div>
      {status && <p className="mt-2 text-sm text-ui-muted">{status}</p>}
      {!courseId && <p className="mt-2 text-sm text-ui-muted">{t.teacherReports.noCourseId}</p>}
    </>
  );
}
