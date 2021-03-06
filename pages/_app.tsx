import { useEffect } from 'react';
import Amplify from 'aws-amplify';
import type { AppProps } from 'next/app';

export default function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    Amplify.configure({
      ssr: true,
      Auth: {
        identityPoolId: process.env.NEXT_PUBLIC_IDENTITY_POOL_ID,
        region: process.env.NEXT_PUBLIC_REGION,
        userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID,
        userPoolWebClientId: process.env.NEXT_PUBLIC_USER_POOL_WEB_CLIENT_ID,
      },
    });
  }, []);

  return <Component {...pageProps} />;
}
