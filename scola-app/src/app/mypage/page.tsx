import type { Metadata } from 'next';
import MyPage from './content';

export const metadata: Metadata = {
  title: '마이페이지',
  robots: { index: false, follow: false },
};

export default function Page() {
  return <MyPage />;
}
