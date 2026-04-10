import { StandardPlaceholderPage } from '../../components/layout';

export default function TeacherCourseManagePage() {
  return (
    <StandardPlaceholderPage
      title="Manage Course"
      description="Instructor workspace for full course administration."
      nav={{
        title: 'Management Navigation',
        body: 'Sections for settings, content, students and reports.',
      }}
      sections={
        [
          {
            title: 'Course Settings',
            body: 'Editable course metadata and visibility controls.',
          },
          {
            title: 'Lessons And Exercises',
            body: 'Structured content management workspace.',
          },
          {
            title: 'Students And Reports',
            body: 'Student list, exports and reporting actions.',
          },
        ] as const
      }
      aside={{
        title: 'Course Health',
        body: 'Quality indicators and completion overview placeholder.',
      }}
      footer={{
        title: 'Safety Actions',
        body: 'Archive and delete workflow placeholder.',
      }}
    />
  );
}
