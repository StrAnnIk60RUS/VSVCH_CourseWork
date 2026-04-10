import { StandardPlaceholderPage } from '../../components/layout';

export default function LoginPage() {
  return (
    <StandardPlaceholderPage
      title="Login"
      description="Authentication entry layout for returning users."
      nav={{
        title: 'Access Navigation',
        body: 'Alternative routes to register and account recovery.',
      }}
      sections={
        [
          {
            title: 'Credentials Form',
            body: 'Email and password input placeholders.',
          },
          {
            title: 'Auth Status',
            body: 'Validation and feedback message area.',
          },
          {
            title: 'Navigation',
            body: 'Links to registration and recovery flow placeholders.',
          },
        ] as const
      }
      aside={{
        title: 'Security Notes',
        body: 'Sign-in guidance and safety tips placeholder.',
      }}
      footer={{
        title: 'Help',
        body: 'Contact and troubleshooting hints placeholder.',
      }}
    />
  );
}
