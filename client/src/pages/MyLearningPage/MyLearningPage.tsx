import { StandardPlaceholderPage } from '../../components/layout';

export default function MyLearningPage() {
  return (
    <StandardPlaceholderPage
      title="My Learning"
      description="Student dashboard for active enrollments and continuation."
      nav={{
        title: 'Learning Navigation',
        body: 'Quick route shortcuts to progress and favorites.',
      }}
      sections={
        [
          {
            title: 'Enrolled Courses',
            body: 'Overview of active enrollments and progress.',
          },
          {
            title: 'Learning Shortcuts',
            body: 'Quick links to continue lessons and course pages.',
          },
          {
            title: 'Enrollment Actions',
            body: 'Manage enrollment-related actions area.',
          },
        ] as const
      }
      aside={{
        title: 'Study Plan',
        body: 'Milestones and upcoming tasks placeholder.',
      }}
      footer={{
        title: 'Recent Activity',
        body: 'Latest learning updates summary placeholder.',
      }}
    />
  );
}
