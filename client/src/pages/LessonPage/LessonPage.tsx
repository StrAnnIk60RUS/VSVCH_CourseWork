import { StandardPlaceholderPage } from '../../components/layout';

export default function LessonPage() {
  return (
    <StandardPlaceholderPage
      title="Lesson"
      description="Learning session layout for content and exercise flow."
      nav={{
        title: 'Lesson Navigation',
        body: 'Back to course, lesson sequence and context links.',
      }}
      sections={
        [
          {
            title: 'Lesson Content',
            body: 'Text, media and contextual lesson information.',
          },
          {
            title: 'Exercises',
            body: 'Exercise list with answer input placeholders.',
          },
          {
            title: 'Progress Actions',
            body: 'Completion and submission action area.',
          },
        ] as const
      }
      aside={{
        title: 'Help And Notes',
        body: 'Tips, glossary and reference placeholders.',
      }}
      footer={{
        title: 'Lesson Status',
        body: 'Completion state and next lesson prompt area.',
      }}
    />
  );
}
