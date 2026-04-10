import { StandardPlaceholderPage } from '../../components/layout';

export default function ProgressPage() {
  return (
    <StandardPlaceholderPage
      title="Progress"
      description="Tracking and reporting layout for student performance."
      nav={{
        title: 'Progress Navigation',
        body: 'Switch between metrics, timeline and reports.',
      }}
      sections={
        [
          {
            title: 'Statistics',
            body: 'Overall progress metrics and summary cards.',
          },
          {
            title: 'Charts',
            body: 'Visual progress chart placeholder.',
          },
          {
            title: 'Reports',
            body: 'Export and email report actions area.',
          },
        ] as const
      }
      aside={{
        title: 'Timeline',
        body: 'Recent submissions and milestones placeholder.',
      }}
      footer={{
        title: 'Status Notes',
        body: 'Interpretation hints and next learning steps.',
      }}
    />
  );
}
