import { StandardPlaceholderPage } from '../../components/layout';

export default function FavoritesPage() {
  return (
    <StandardPlaceholderPage
      title="Favorites"
      description="Saved courses area with structured review flow."
      nav={{
        title: 'Favorites Navigation',
        body: 'Links to catalog and active learning routes.',
      }}
      sections={
        [
          {
            title: 'Favorites List',
            body: 'Saved courses collection placeholder.',
          },
          {
            title: 'Course Preview',
            body: 'Selected course details quick look area.',
          },
          {
            title: 'Actions',
            body: 'Favorite management controls area.',
          },
        ] as const
      }
      aside={{
        title: 'Tags And Notes',
        body: 'Personal labels and notes placeholder.',
      }}
      footer={{
        title: 'Recommendation Hints',
        body: 'Related course suggestion placeholder.',
      }}
    />
  );
}
