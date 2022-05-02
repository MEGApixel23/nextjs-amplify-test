import type { NextPage } from 'next';
// import Head from 'next/head';
// import Image from 'next/image';
import { Dispatch, SetStateAction, useState } from 'react';
import { Auth } from 'aws-amplify';

type ILoginState = {
  status: string | null;
  error: string | null;
};

const signInFn = async (
  username: string,
  password: string,
  onStateChange: Dispatch<SetStateAction<ILoginState>>,
) => {
  try {
    await Auth.signIn(username, password);

    onStateChange({ status: 'signedIn', error: null });
  } catch (err: unknown) {
    const error = err as Error & { code: string };

    if (error.code === 'UserNotConfirmedException') {
      await Auth.resendSignUp(username);

      onStateChange({ status: 'confirmSignUp', error: null });
    } else if (error.code === 'NotAuthorizedException') {
      // The error happens when the incorrect password is provided
      onStateChange({
        status: 'NotAuthorizedException',
        error: 'Login failed.',
      });
    } else if (error.code === 'UserNotFoundException') {
      // The error happens when the supplied username/email does not exist in the Cognito user pool
      onStateChange({
        status: 'UserNotFoundException',
        error: 'Login failed.',
      });

      console.error(err);
    } else {
      onStateChange({ status: 'Error', error: 'An error has occurred.' });

      console.error(err);
    }
  }
};

const Home: NextPage = () => {
  const [result, setResult] = useState<{
    status: string | null;
    error: string | null;
  }>({ status: null, error: null });
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const signIn = async () => {
    await signInFn(email, password, setResult);
  };

  return (
    <div>
      <div>Status: {result?.status}</div>
      <div>Error: {result?.error}</div>
      <input
        type='email'
        onChange={({ target: { value } }) => setEmail(value)}
      />
      <input
        type='password'
        onChange={({ target: { value } }) => setPassword(value)}
      />
      <button onClick={signIn}>Login</button>
    </div>
  );
};

export default Home;
