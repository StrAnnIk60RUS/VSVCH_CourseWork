/**
 * @param {string} value
 */
function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

/**
 * @param {{
 *   locale: 'ru' | 'en',
 *   reportTypeLabel: string,
 *   reportFormatLabel: string,
 *   generatedAtLabel: string,
 *   generatedAtValue: string,
 * }} options
 */
export function buildReportMail(options) {
  const strings =
    options.locale === 'ru'
      ? {
          subject: `VSVH: ${options.reportTypeLabel} (${options.reportFormatLabel})`,
          title: 'Ваш отчет готов',
          intro:
            'Спасибо, что используете VSVH. Во вложении находится запрошенный файл отчета.',
          reportType: 'Тип отчета',
          reportFormat: 'Формат',
          footer: 'Это автоматическое письмо, отвечать на него не нужно.',
        }
      : {
          subject: `VSVH: ${options.reportTypeLabel} (${options.reportFormatLabel})`,
          title: 'Your report is ready',
          intro: 'Thanks for using VSVH. The requested report file is attached.',
          reportType: 'Report type',
          reportFormat: 'Format',
          footer: 'This is an automated message, please do not reply.',
        };

  const reportType = escapeHtml(options.reportTypeLabel);
  const reportFormat = escapeHtml(options.reportFormatLabel);
  const generatedAt = escapeHtml(options.generatedAtValue);

  return {
    subject: strings.subject,
    text: [
      strings.title,
      '',
      strings.intro,
      '',
      `${strings.reportType}: ${options.reportTypeLabel}`,
      `${strings.reportFormat}: ${options.reportFormatLabel}`,
      `${options.generatedAtLabel}: ${options.generatedAtValue}`,
      '',
      'VSVH',
      strings.footer,
    ].join('\n'),
    html: `
      <div style="background:#f3f4f6;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#111827;">
        <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
          <div style="background:#0f172a;color:#ffffff;padding:16px 20px;font-size:20px;font-weight:700;">VSVH</div>
          <div style="padding:20px;">
            <h1 style="margin:0 0 10px 0;font-size:22px;line-height:1.2;color:#111827;">${strings.title}</h1>
            <p style="margin:0 0 16px 0;font-size:14px;line-height:1.5;color:#374151;">${strings.intro}</p>
            <table role="presentation" style="width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
              <tbody>
                <tr>
                  <td style="width:40%;padding:10px 12px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;">${strings.reportType}</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#111827;font-weight:600;">${reportType}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:#f9fafb;border-bottom:1px solid #e5e7eb;font-size:13px;color:#374151;">${strings.reportFormat}</td>
                  <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-size:13px;color:#111827;font-weight:600;">${reportFormat}</td>
                </tr>
                <tr>
                  <td style="padding:10px 12px;background:#f9fafb;font-size:13px;color:#374151;">${options.generatedAtLabel}</td>
                  <td style="padding:10px 12px;font-size:13px;color:#111827;font-weight:600;">${generatedAt}</td>
                </tr>
              </tbody>
            </table>
            <p style="margin:16px 0 0 0;font-size:12px;line-height:1.4;color:#6b7280;">${strings.footer}</p>
          </div>
        </div>
      </div>
    `.trim(),
  };
}
