import { StandardPlaceholderPage } from '../../components/layout';

export default function TeacherCoursesPage() {
  return (
    <StandardPlaceholderPage
      title="Teacher Courses"
      description="Instructor dashboard for owned course collection."
      nav={{
        title: 'Teacher Navigation',
        body: 'Quick route links to create and manage courses.',
      }}
      sections={
        [
          {
            title: 'Courses Overview',
            body: 'Owned courses list with aggregate indicators.',
          },
          {
            title: 'Search And Filters',
            body: 'Controls for narrowing course collection.',
          },
          {
            title: 'Actions',
            body: 'Create course and open management action area.',
          },
        ] as const
      }
      aside={{
        title: 'Teaching Metrics',
        body: 'Enrollment and activity summary placeholder.',
      }}
      footer={{
        title: 'Workflow Tips',
        body: 'Course lifecycle guidance placeholder.',
      }}
    />
  );
}
