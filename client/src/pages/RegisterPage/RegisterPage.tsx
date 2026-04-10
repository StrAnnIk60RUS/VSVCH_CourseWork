import { StandardPlaceholderPage } from '../../components/layout';

export default function RegisterPage() {
  return (
    <StandardPlaceholderPage
      title="Register"
      description="Onboarding structure for creating a new account."
      nav={{
        title: 'Registration Navigation',
        body: 'Guidance between signup, login and policy sections.',
      }}
      sections={
        [
          {
            title: 'Registration Form',
            body: 'Account fields and role selection placeholder.',
          },
          {
            title: 'Validation',
            body: 'Form and API feedback message area.',
          },
          {
            title: 'Navigation',
            body: 'Link to login and post-signup guidance placeholder.',
          },
        ] as const
      }
      aside={{
        title: 'Requirements',
        body: 'Password and profile requirement notes placeholder.',
      }}
      footer={{
        title: 'Consent',
        body: 'Terms and privacy acknowledgement area.',
      }}
    />
  );
}
