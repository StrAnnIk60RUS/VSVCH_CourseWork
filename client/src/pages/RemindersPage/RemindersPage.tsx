import { StandardPlaceholderPage } from '../../components/layout';

export default function RemindersPage() {
  return (
    <StandardPlaceholderPage
      title="Reminders"
      description="Personal reminder workspace with scheduling structure."
      nav={{
        title: 'Reminder Navigation',
        body: 'Time ranges, upcoming and archived reminder sections.',
      }}
      sections={
        [
          {
            title: 'Reminder List',
            body: 'Upcoming and past reminders placeholder.',
          },
          {
            title: 'Reminder Form',
            body: 'Create and edit reminder fields area.',
          },
          {
            title: 'Actions',
            body: 'Save, update and remove action controls.',
          },
        ] as const
      }
      aside={{
        title: 'Priority Legend',
        body: 'Priority and state explanation placeholder.',
      }}
      footer={{
        title: 'Notification Notes',
        body: 'Delivery channels and behavior guidance placeholder.',
      }}
    />
  );
}
