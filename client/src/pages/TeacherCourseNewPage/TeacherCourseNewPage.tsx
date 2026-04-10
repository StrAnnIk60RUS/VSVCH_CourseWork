import { StandardPlaceholderPage } from '../../components/layout';

export default function TeacherCourseNewPage() {
  return (
    <StandardPlaceholderPage
      title="New Course"
      description="Course creation scaffold for instructors."
      nav={{
        title: 'Creation Navigation',
        body: 'Flow hints for draft, review and publish steps.',
      }}
      sections={
        [
          {
            title: 'Course Form',
            body: 'Metadata fields for new course creation.',
          },
          {
            title: 'Preview',
            body: 'Draft overview area before submission.',
          },
          {
            title: 'Submit Actions',
            body: 'Primary and secondary form actions placeholder.',
          },
        ] as const
      }
      aside={{
        title: 'Content Checklist',
        body: 'Minimum content and quality checklist placeholder.',
      }}
      footer={{
        title: 'Publishing Notes',
        body: 'Visibility and post-create steps placeholder.',
      }}
    />
  );
}
