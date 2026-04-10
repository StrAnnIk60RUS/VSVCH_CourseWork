import { StandardPlaceholderPage } from '../../components/layout';

export default function CourseDetailPage() {
  return (
    <StandardPlaceholderPage
      title="Course Detail"
      description="Detailed view of a single course and lesson roadmap."
      nav={{
        title: 'Course Navigation',
        body: 'Anchors for overview, lessons and related actions.',
      }}
      sections={
        [
          {
            title: 'Course Summary',
            body: 'Description, instructor and metadata.',
          },
          {
            title: 'Lessons',
            body: 'Ordered list of lessons and navigation points.',
          },
          {
            title: 'Actions',
            body: 'Enrollment, favorite and management entry area.',
          },
        ] as const
      }
      aside={{
        title: 'Progress Preview',
        body: 'Course completion and engagement status placeholder.',
      }}
      footer={{
        title: 'Related Links',
        body: 'Navigation to lesson start and course neighbors.',
      }}
    />
  );
}
