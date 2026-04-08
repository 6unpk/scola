import type { Metadata } from 'next';
import RegisterPage from './content';

export const metadata: Metadata = {
  title: '회원가입',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <RegisterPage />;
}
