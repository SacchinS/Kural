import { Amplify } from 'aws-amplify';

export function configureAmplify() {
  const userPoolId = process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? '';
  const userPoolClientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? '';
  console.log('[amplify] configureAmplify userPoolId:', userPoolId);
  console.log('[amplify] configureAmplify userPoolClientId:', userPoolClientId);
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId,
        userPoolClientId,
      },
    },
  });
}
